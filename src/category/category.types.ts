export type CategoryType = 'category' | 'subcategory';

export interface ICategory {
  id: string;
  sheetId: string;
  ownerId: string;
  name: string;
  image_path: string;
  type: CategoryType;
  mainCategoryId?: string;
}

export interface ISetCategory {
  sheetId: string;
  ownerId: string;
  name: string;
  image_path: string;
  type: CategoryType;
  mainCategoryId?: string;
}
