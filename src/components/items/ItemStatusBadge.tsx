import { Item } from '@/types/item';
import { ageInMonths, isExpired } from '@/lib/utils/date';
import { LOT_LOW_STOCK_THRESHOLD } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';

interface ItemStatusBadgeProps {
  item: Item;
}

export function ItemStatusBadge({ item }: ItemStatusBadgeProps) {
  if (isExpired(item)) {
    return <Badge variant="danger">期限超過</Badge>;
  }

  if (item.managementType === 'lot' && item.quantity > 0) {
    const ratio = item.remainingQuantity / item.quantity;
    if (ratio <= LOT_LOW_STOCK_THRESHOLD) {
      return <Badge variant="warning">在庫少</Badge>;
    }
  }

  if (item.expectedLifeMonths > 0) {
    const age = ageInMonths(item.purchaseDate);
    const ratio = age / item.expectedLifeMonths;
    if (ratio >= 0.8) {
      return <Badge variant="warning">もうすぐ期限</Badge>;
    }
  }

  return <Badge variant="success">良好</Badge>;
}
