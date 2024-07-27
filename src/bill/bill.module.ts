import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { ClonseBillService } from './close-bill.service';
import { CreditCardModule } from 'src/credit_card/credit_card.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  imports: [CreditCardModule, ItemsModule],
  controllers: [BillController],
  providers: [ClonseBillService],
})
export class BillModule {}
