import { firebaseTimesStampType } from 'src/shared/utils/firebase/firebase.types';

export type CardBrands = 'visa' | 'mastercard' | 'elo';

export default interface ICreditCard {
  id: string;
  ownerId: string;
  nickname: string;
  cardNumber: string;
  flag: CardBrands;
  expirationDate: firebaseTimesStampType;
  lastBill?: firebaseTimesStampType;
  financialInstitution: string;
  spendingLimit: number;
  availableLimit: number;
}

export interface ICreditCardLimitsData {
  id: string;
  ownerId: string;
  spendingLimit: number;
  availableLimit: number;
}
