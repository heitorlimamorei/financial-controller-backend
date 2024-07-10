import { Injectable } from '@nestjs/common';
import { FirebaseImplementation } from './shared/providers/firebase/implementation';

interface ISheet {
  id: string;
  owner: string;
  type: string;
  tiposDeGastos: string[];
  totalValue: number;
  name: string;
}

@Injectable()
export class AppService {
  constructor(private readonly firebase: FirebaseImplementation) {}
  async getHello() {
   const user = await this.firebase.findOne({
    id: 'vPbF899RZHBFQIjJNEQN',
    collection: 'users'
   });

   return user;
  }
}
