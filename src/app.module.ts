import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './shared/providers/firebase/firebase.module';
import { UserModule } from './user/user.module';
import { CreditCardModule } from './credit_card/credit_card.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AccountModule } from './account/account.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    FirebaseModule,
    UserModule,
    CreditCardModule,
    SubscriptionModule,
    AccountModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
