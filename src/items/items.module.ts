import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { FirebaseModule } from 'src/shared/providers/firebase/firebase.module';
import { AccountModule } from 'src/account/account.module';
import { CreditCardItemService } from './credit_card_item.service';
import { CreditCardModule } from 'src/credit_card/credit_card.module';
import { CreditCardItemController } from './credit_card_item.controller';
import { RecurringIemService } from './recurring_item.service';
import { RecurringItemController } from './recurring_item.controller';

@Module({
  exports: [CreditCardItemService],
  imports: [FirebaseModule, AccountModule, CreditCardModule],
  controllers: [
    ItemsController,
    CreditCardItemController,
    RecurringItemController,
  ],
  providers: [ItemsService, CreditCardItemService, RecurringIemService],
})
export class ItemsModule {}
