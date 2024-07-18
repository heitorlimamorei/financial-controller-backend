import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { FirebaseModule } from 'src/shared/providers/firebase/firebase.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [FirebaseModule, AccountModule],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
