import { Module } from '@nestjs/common';
import { CreditCardService } from './credit_card.service';
import { CreditCardController } from './credit_card.controller';
import { FirebaseModule } from 'src/shared/providers/firebase/firebase.module';
import { CreditCardUtilModule } from 'src/shared/providers/credit_card_util/CreditCardUtils.module';

@Module({
  exports: [CreditCardService],
  imports: [FirebaseModule, CreditCardUtilModule],
  controllers: [CreditCardController],
  providers: [CreditCardService],
})
export class CreditCardModule {}
