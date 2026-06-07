'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useItem } from '@/hooks/useItem';
import { useTransactions } from '@/hooks/useTransactions';
import { deleteItem } from '@/lib/firestore/items';
import { ageInMonths, formatDateShort, formatDateJa } from '@/lib/utils/date';
import { MANAGEMENT_TYPE_LABELS } from '@/lib/constants';
import { PageHeader } from '@/components/layout/PageHeader';
import { ItemStatusBadge } from '@/components/items/ItemStatusBadge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { item, loading } = useItem(id);
  const { transactions } = useTransactions(id);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (loading) return <LoadingSpinner fullPage />;
  if (!item) return <p className="text-slate-500">アイテムが見つかりません</p>;

  const age = ageInMonths(item.purchaseDate);

  async function handleDelete() {
    await deleteItem(id);
    router.push('/items');
  }

  return (
    <div>
      <PageHeader
        title={item.name}
        action={
          <div className="flex gap-2">
            <Link href={`/items/${id}/edit`}>
              <Button variant="secondary" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                編集
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="space-y-4 max-w-lg">
        <Card>
          <CardContent className="py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <Badge>{item.category}</Badge>
                <Badge variant="info">{MANAGEMENT_TYPE_LABELS[item.managementType]}</Badge>
              </div>
              <ItemStatusBadge item={item} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">購入日</p>
                <p className="font-medium text-slate-900">{formatDateShort(item.purchaseDate)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">経過</p>
                <p className="font-medium text-slate-900">
                  {age}ヶ月
                  {item.expectedLifeMonths > 0 && (
                    <span className="text-slate-400"> / {item.expectedLifeMonths}ヶ月</span>
                  )}
                </p>
              </div>
              {item.purchasePrice > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">購入価格</p>
                  <p className="font-medium text-slate-900">
                    ¥{item.purchasePrice.toLocaleString()}
                  </p>
                </div>
              )}
              {item.managementType === 'lot' && (
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">残数</p>
                  <p className="font-medium text-slate-900">
                    {item.remainingQuantity} / {item.quantity}
                  </p>
                </div>
              )}
            </div>

            {item.managementType === 'lot' && item.quantity > 0 && (
              <div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (item.remainingQuantity / item.quantity) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {item.memo && (
              <div>
                <p className="text-xs text-slate-500 mb-0.5">メモ</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{item.memo}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {item.managementType === 'lot' && (
          <Link href={`/items/${id}/transactions/new`}>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-1" />
              購入 / 廃棄を登録
            </Button>
          </Link>
        )}

        {transactions.length > 0 && (
          <Card>
            <CardHeader>
              <p className="text-sm font-semibold text-slate-900">履歴</p>
            </CardHeader>
            <CardContent className="py-2">
              <ul className="divide-y divide-slate-50">
                {transactions.map((tx) => (
                  <li key={tx.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span
                        className={`text-xs font-medium ${
                          tx.type === 'purchase' ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {tx.type === 'purchase' ? '+' : '-'}
                        {tx.quantity}
                      </span>
                      {tx.memo && (
                        <span className="ml-2 text-xs text-slate-400">{tx.memo}</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">
                      {formatDateShort(tx.transactionDate)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="削除の確認"
      >
        <p className="text-sm text-slate-600 mb-4">
          「{item.name}」を削除しますか？この操作は元に戻せません。
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setConfirmDelete(false)}>
            キャンセル
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>
            削除する
          </Button>
        </div>
      </Modal>
    </div>
  );
}
