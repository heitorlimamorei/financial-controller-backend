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
  date: firebaseTimesStampType;
  creditCardId: string;
}
