import {
  collection,
  collectionGroup,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  QueryDocumentSnapshot,
  Timestamp,
  FirestoreDataConverter,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Transaction, TransactionType } from '@/types/transaction';

function toISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  return '';
}

const txConverter: FirestoreDataConverter<Transaction> = {
  toFirestore: (tx: Transaction) => tx,
  fromFirestore: (snap: QueryDocumentSnapshot): Transaction => {
    const d = snap.data();
    return {
      id: snap.id,
      itemId: d.itemId,
      userId: d.userId,
      type: d.type,
      quantity: d.quantity,
      transactionDate: d.transactionDate,
      memo: d.memo ?? '',
      createdAt: toISO(d.createdAt),
    };
  },
};

export function subscribeAllUserTransactions(
  userId: string,
  onChange: (txs: Transaction[]) => void,
  onError: (err: Error) => void
) {
  const q = query(
    collectionGroup(db, 'transactions').withConverter(txConverter),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snap) => onChange(snap.docs.map((d) => d.data())), onError);
}

export function subscribeTransactions(
  itemId: string,
  onChange: (txs: Transaction[]) => void,
  onError: (err: Error) => void
) {
  const q = query(
    collection(db, 'items', itemId, 'transactions').withConverter(txConverter),
    orderBy('transactionDate', 'desc')
  );
  return onSnapshot(q, (snap) => onChange(snap.docs.map((d) => d.data())), onError);
}

export async function createTransaction(
  itemId: string,
  userId: string,
  type: TransactionType,
  quantity: number,
  transactionDate: string,
  memo: string
): Promise<void> {
  const itemRef = doc(db, 'items', itemId);
  const txColRef = collection(db, 'items', itemId, 'transactions');

  await runTransaction(db, async (txn) => {
    const itemSnap = await txn.get(itemRef);
    if (!itemSnap.exists()) throw new Error('Item not found');

    const current = itemSnap.data().remainingQuantity as number;
    const totalQty = itemSnap.data().quantity as number;
    const delta = type === 'purchase' ? quantity : -quantity;
    const newRemaining = current + delta;

    if (newRemaining < 0) throw new Error('残数が0を下回ります');

    txn.update(itemRef, {
      remainingQuantity: newRemaining,
      quantity: type === 'purchase' ? totalQty + quantity : totalQty,
      updatedAt: serverTimestamp(),
    });

    txn.set(doc(txColRef), {
      itemId,
      userId,
      type,
      quantity,
      transactionDate,
      memo,
      createdAt: serverTimestamp(),
    });
  });
}
