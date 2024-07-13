import { firebaseTimesStampType } from 'src/shared/utils/firebase/firebase.types';

export interface ISubscription {
  id: string;
  ownerId: string;
  type: string;
  price: number;
  start_date: firebaseTimesStampType;
  end_date: firebaseTimesStampType;
}
