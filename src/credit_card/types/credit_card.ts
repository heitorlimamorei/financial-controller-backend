export type CardBrands = 'visa' | 'mastercard' | 'elo';

export default interface ICreditCard {
  id: string;
  ownerId: string;
  nickname: string;
  cardNumber: string;
  flag: CardBrands;
  expirationDate: string;
  financialInstitution: string;
  speendingLimit: number;
  availableLimit: number;
}

export interface ICreditCardLimitsData {
  id: string;
  ownerId: string;
  speendingLimit: number;
  availableLimit: number;
}
