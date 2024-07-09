import { Injectable } from '@nestjs/common';
import { FirebaseImplementation } from './shared/providers/firebase/implementation';
import { collection, getDocs } from 'firebase/firestore';

@Injectable()
export class AppService {
  constructor(private readonly firebase: FirebaseImplementation) {}
  async getHello() {
    const db = this.firebase.getFirestore();

    const sheetCollection = collection(db, 'planilhas');

    const sheetSnapShot = await getDocs(sheetCollection);

    const sheets = sheetSnapShot.docs.map(doc => ({ id: doc.id, data: doc.data() }));


    return sheets;
  }
}
