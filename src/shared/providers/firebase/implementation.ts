import { Firestore, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

export class FirebaseImplementation {
    private db: Firestore;

    constructor() {
        const app = initializeApp({
          apiKey: 'AIzaSyDmQZMXBMLtwaVWubvnVkXK0iH8sZQgbIQ',
          authDomain: 'financialcontroller-6c561.firebaseapp.com',
          projectId: 'financialcontroller-6c561',
          storageBucket: 'financialcontroller-6c561.appspot.com',
          messagingSenderId: '382232109506',
          appId: '1:382232109506:web:72114f5fb0a2af84b9765b',
        });
        this.db = getFirestore(app);
    }

    getFirestore(): Firestore {
        return this.db;
    }
}