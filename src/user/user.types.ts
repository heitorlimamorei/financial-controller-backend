import { firebaseTimesStampType } from 'src/shared/utils/firebase/firebase.types';

export interface ICreateResp {
  id: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  sheetIds: string[];
  personalSpreadSheet: string;
  createdAt?: firebaseTimesStampType;
  updatedAt?: firebaseTimesStampType;
}
