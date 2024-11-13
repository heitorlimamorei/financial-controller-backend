import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { CloseBillService } from './close-bill.service';
import { CreditCardModule } from 'src/credit_card/credit_card.module';
import { ItemsModule } from 'src/items/items.module';
import { FirebaseModule } from 'src/shared/providers/firebase/firebase.module';
import { BillService } from './bill.service';
import { TextcompressionModule } from 'src/shared/providers/textcompression/textcompression.module';

@Module({
  imports: [
    CreditCardModule,
    ItemsModule,
    FirebaseModule,
    TextcompressionModule,
  ],
  controllers: [BillController],
  providers: [CloseBillService, BillService],
})
export class BillModule {}
