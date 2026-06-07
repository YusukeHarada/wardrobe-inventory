import { Category } from './item';

export interface WishlistItem {
  id: string;
  userId: string;
  name: string;
  category: Category;
  expectedPrice: number;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export type WishlistFormData = Omit<WishlistItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
