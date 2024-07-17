export type SpreadSheetType = 'PERSONAL' | 'COLABORATIVE';

export interface IPersonalSpreadSheet {
  id: string;
  ownerId: string;
  name: string;
  type: SpreadSheetType;
}
