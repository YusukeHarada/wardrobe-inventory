import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  QueryDocumentSnapshot,
  Timestamp,
  FirestoreDataConverter,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WishlistItem, WishlistFormData } from '@/types/wishlist';

function toISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  return '';
}

const wishlistConverter: FirestoreDataConverter<WishlistItem> = {
  toFirestore: (item: WishlistItem) => item,
  fromFirestore: (snap: QueryDocumentSnapshot): WishlistItem => {
    const d = snap.data();
    return {
      id: snap.id,
      userId: d.userId,
      name: d.name,
      category: d.category,
      expectedPrice: d.expectedPrice,
      memo: d.memo ?? '',
      createdAt: toISO(d.createdAt),
      updatedAt: toISO(d.updatedAt),
    };
  },
};

export function subscribeWishlist(
  userId: string,
  onChange: (items: WishlistItem[]) => void,
  onError: (err: Error) => void
) {
  const q = query(
    collection(db, 'wishlist').withConverter(wishlistConverter),
    where('userId', '==', userId)
  );
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs
        .map((d) => d.data())
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      onChange(items);
    },
    onError
  );
}

export async function createWishlistItem(
  userId: string,
  data: WishlistFormData
): Promise<string> {
  const ref = await addDoc(collection(db, 'wishlist'), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateWishlistItem(
  wishlistId: string,
  data: Partial<WishlistFormData>
): Promise<void> {
  await updateDoc(doc(db, 'wishlist', wishlistId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteWishlistItem(wishlistId: string): Promise<void> {
  await deleteDoc(doc(db, 'wishlist', wishlistId));
}
