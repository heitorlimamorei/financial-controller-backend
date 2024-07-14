import { firebaseTimesStampType } from 'src/shared/utils/firebase/firebase.types';

// Subcription interface
export interface ISubscription {
  id: string;
  ownerId: string;
  type: string;
  price: number;
  start_date: firebaseTimesStampType;
  end_date: firebaseTimesStampType;
}
