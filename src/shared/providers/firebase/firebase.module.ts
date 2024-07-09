import { Module } from '@nestjs/common';
import { FirebaseImplementation } from './implementation';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [FirebaseImplementation],
  exports: [FirebaseImplementation],
})
export class FirebaseModule {}
