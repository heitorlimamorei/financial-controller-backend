export interface IBill {
  id: string;
  ownerId: string;
  creditCardId: string;
  sheetId: string;
  total: number;
  ids: string[];
  resume: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBillReport {
  totalValue: number;
  items: {
    id: string;
    name: string;
    date: string; // JSON DATE
    installment: number;
    hasBeenPaid: boolean;
    parcellsNumber: number;
    currentParcell: number;
    amount: number;
  }[];
}
