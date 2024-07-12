import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import {
  ICreatePayload,
  IDeleteManyPayload,
  IDelteOnePayload,
  IFindAllPayload,
  IFindOnePayload,
  IQuery,
  ISetDocPayload,
  IUpdateOnePayload,
} from './types/firebase.api.types';
import sanitilizeArrayData from 'src/shared/utils/firebase/transformers';
import { HttpException } from '@nestjs/common';
import { PromiseScheduler } from 'src/shared/utils/resources/promises';

export class FirebaseImplementation {
  private db: Firestore;

  constructor() {
    const app = initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      appId: process.env.APP_ID,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      storageBucket: process.env.storageBucket,
    });
    this.db = getFirestore(app);
  }

  private generateFirebaseError(message: string, code: number) {
    throw new HttpException(`REPOSITORY ERROR: ${message}`, code);
  }

  async findAll<T>(props: IFindAllPayload): Promise<T[]> {
    let queries: IQuery<any>[] = [];
    if (!props.collection) {
      this.generateFirebaseError(
        'Firebase collection is required to run findAll',
        500,
      );
    }

    if (props.query) {
      queries = props.query;
    }

    const collectionRef = collection(this.db, props.collection);

    const firebaseQueries = query(
      collectionRef,
      ...queries?.map((query) =>
        where(query.field, query.condition, query.value),
      ),
    );

    const snapShot = await getDocs(firebaseQueries);

    const data = sanitilizeArrayData<T>(snapShot);

    let queue = [data];

    if (props.filter) {
      const lastIndex = queue.length - 1;
      queue.push(queue[lastIndex].filter(props.filter));
    }

    if (props.map) {
      const lastIndex = queue.length - 1;
      queue.push(queue[lastIndex].map((c) => props.map(c)));
    }

    return queue[queue.length - 1];
  }

  async findOne<T>(props: IFindOnePayload): Promise<T> {
    let queries: IQuery<any>[] = [];
    if (!props.collection) {
      this.generateFirebaseError(
        'Firebase collection is required to run findOne',
        500,
      );
    }

    if (props.query) {
      queries = props.query;
    }

    let queue = [];

    if (props.id) {
      const docRef = doc(this.db, `${props.collection}/${props.id}`);
      const docSnapShot = await getDoc(docRef);

      if (!docSnapShot.exists()) {
        throw new HttpException('Failed to find document', 404);
      }
      
      queue.push({ id: docSnapShot.id, ...docSnapShot.data() } as T);
    }

    const collectionRef = collection(this.db, props.collection);

    if (queue.length == 0) {
      const firebaseQueries = query(
        collectionRef,
        ...queries?.map((query) =>
          where(query.field, query.condition, query.value),
        ),
      );

      const snapShot = await getDocs(firebaseQueries);

      const data = sanitilizeArrayData<T>(snapShot);

      if (data.length > 1) {
        this.generateFirebaseError(
          'Multiple documents found with the same query',
          409,
        );
      }

      queue.push(data);
    }

    if (props.map) {
      const lastIndex = queue.length - 1;
      queue.push(props.map(queue[lastIndex]));
    }

    return queue[queue.length - 1];
  }

  async Create(props: ICreatePayload): Promise<string> {
    if (!props.collection) {
      this.generateFirebaseError(
        'Firebase collection is required to run Create',
        500,
      );
    }

    const collectionRef = collection(this.db, props.collection);

    const docRef = await addDoc(collectionRef, {
      ...props.payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!docRef.id) {
      this.generateFirebaseError('Failed to create document', 500);
    }

    return docRef.id;
  }

  async UpdateOne(props: IUpdateOnePayload): Promise<void> {
    if (!props.collection) {
      this.generateFirebaseError(
        'Firebase collection is required to run UpdateOne',
        500,
      );
    }

    if (!props.id) {
      this.generateFirebaseError(
        'Firebase document ID is required to run UpdateOne',
        500,
      );
    }

    const docRef = doc(this.db, `${props.collection}/${props.id}`);

    await updateDoc(docRef, {
      ...props.payload,
      updatedAt: new Date(),
    });
  }

  async SetDoc(props: ISetDocPayload): Promise<void> {
    if (!props.collection) {
      this.generateFirebaseError(
        'Firebase collection is required to run UpdateOne',
        500,
      );
    }

    if (!props.id) {
      this.generateFirebaseError(
        'Firebase document ID is required to run UpdateOne',
        500,
      );
    }

    const docRef = doc(this.db, `${props.collection}/${props.id}`);

    await setDoc(docRef, props.payload);
  }

  async DeleteOne(props: IDelteOnePayload): Promise<void> {
    if (!props.collection) {
      this.generateFirebaseError(
        'Firebase collection is required to run UpdateOne',
        500,
      );
    }

    if (!props.id) {
      this.generateFirebaseError(
        'Firebase document ID is required to run UpdateOne',
        500,
      );
    }

    const docRef = doc(this.db, `${props.collection}/${props.id}`);

    await deleteDoc(docRef);
  }

  async DeleteMany(props: IDeleteManyPayload): Promise<void> {
    if (!props.collection) {
      this.generateFirebaseError(
        'Firebase collection is required to run UpdateOne',
        500,
      );
    }

    if (props.ids) {
      let promises: Promise<void>[] = [];

      props.ids.forEach((id) => {
        const docRef = doc(this.db, `${props.collection}/${id}`);
        promises.push(deleteDoc(docRef));
      });

      await PromiseScheduler(promises);
      return;
    }

    if (props.query) {
      const ids = await this.findAll({
        collection: props.collection,
        query: props.query,
        map: (doc) => doc.id as string,
      });

      await PromiseScheduler(
        ids.map((id) => deleteDoc(doc(this.db, `${props.collection}/${id}`))),
      );
      return;
    }

    this.generateFirebaseError(
      'Query or ids array is required to run DeleteMany',
      500,
    );
  }
}
