import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { ClonseBillService } from './close-bill.service';
import { CreditCardModule } from 'src/credit_card/credit_card.module';
import { ItemsModule } from 'src/items/items.module';
import { FirebaseModule } from 'src/shared/providers/firebase/firebase.module';
import { BillService } from './bill.service';

@Module({
  imports: [CreditCardModule, ItemsModule, FirebaseModule],
  controllers: [BillController],
  providers: [ClonseBillService, BillService],
})
export class BillModule {}
