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
