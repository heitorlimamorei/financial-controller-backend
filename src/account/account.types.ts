export interface IAccount {
  id: string;
  nickname: string;
  ownerId: string;
  financial_institution: string;
  balance: number;
}

export interface IResolveBalanceDelta {
  ammountPrev: number;
  ammount: number;
  typePrev: 'INCOME' | 'EXPENSE';
  type: 'INCOME' | 'EXPENSE';
  accountId: string;
  ownerId: string;
}
