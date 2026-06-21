export type Category =
  | '衣類'
  | '靴'
  | '靴下'
  | '下着'
  | 'バッグ'
  | '帽子'
  | 'その他';

export type ManagementType = 'individual' | 'lot';

export type Season = 'spring_summer' | 'fall_winter' | 'all_season';

export interface Item {
  id: string;
  userId: string;
  name: string;
  category: Category;
  managementType: ManagementType;
  season: Season;
  purchaseDate: string;
  purchasePrice: number;
  expectedLifeMonths: number;
  quantity: number;
  remainingQuantity: number;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export type ItemFormData = Omit<Item, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
