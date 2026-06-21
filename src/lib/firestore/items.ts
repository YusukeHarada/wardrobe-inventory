import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  QueryDocumentSnapshot,
  Timestamp,
  FirestoreDataConverter,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Item, ItemFormData, Season } from '@/types/item';

function toISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  return '';
}

const itemConverter: FirestoreDataConverter<Item> = {
  toFirestore: (item: Item) => item,
  fromFirestore: (snap: QueryDocumentSnapshot): Item => {
    const d = snap.data();
    return {
      id: snap.id,
      userId: d.userId,
      name: d.name,
      category: d.category,
      managementType: d.managementType,
      season: d.season ?? 'all_season',
      purchaseDate: d.purchaseDate,
      purchasePrice: d.purchasePrice,
      expectedLifeMonths: d.expectedLifeMonths,
      quantity: d.quantity ?? 0,
      remainingQuantity: d.remainingQuantity ?? 0,
      memo: d.memo ?? '',
      createdAt: toISO(d.createdAt),
      updatedAt: toISO(d.updatedAt),
    };
  },
};

export function subscribeItems(
  userId: string,
  onChange: (items: Item[]) => void,
  onError: (err: Error) => void
) {
  const q = query(
    collection(db, 'items').withConverter(itemConverter),
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

export async function getItem(itemId: string): Promise<Item | null> {
  const ref = doc(db, 'items', itemId).withConverter(itemConverter);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function createItem(userId: string, data: ItemFormData): Promise<string> {
  const ref = await addDoc(collection(db, 'items'), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateItem(itemId: string, data: Partial<ItemFormData>): Promise<void> {
  await updateDoc(doc(db, 'items', itemId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function batchUpdateItemsSeason(itemIds: string[], season: Season): Promise<void> {
  const batch = writeBatch(db);
  itemIds.forEach((id) => {
    batch.update(doc(db, 'items', id), { season, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}

export async function deleteItem(itemId: string): Promise<void> {
  const txColRef = collection(db, 'items', itemId, 'transactions');
  const txSnap = await getDocs(txColRef);
  if (!txSnap.empty) {
    const batch = writeBatch(db);
    txSnap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
  await deleteDoc(doc(db, 'items', itemId));
}
