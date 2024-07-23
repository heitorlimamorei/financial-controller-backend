import { firebaseTimesStampType } from 'src/shared/utils/firebase/firebase.types';

export type itemType = 'INCOME' | 'EXPENSE';

export interface IItem {
  id: string;
  categoryId: string;
  ownerId: string;
  name: string;
  description: string;
  accountId: string;
  amount: number;
  date: firebaseTimesStampType;
  type: itemType;
}

export interface ICreditCardItem {
  id: string;
  categoryId: string;
  ownerId: string;
  name: string;
  description: string;
  amount: number;
  creditCardId: string;
  interest: number;
  parcellsNumber: number;
  currentParcell: number;
  date: firebaseTimesStampType;
}

export interface IUpdateCardItem {
  name?: string;
  description?: string;
  parcellsNumber?: number;
  interest?: number;
  categoryId?: string;
  amount?: number;
  date?: string | Date;
}
