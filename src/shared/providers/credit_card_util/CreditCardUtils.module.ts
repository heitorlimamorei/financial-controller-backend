import { Module } from '@nestjs/common';
import { CreditCardUtils } from './CreditCardUtils';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [CreditCardUtils],
  exports: [CreditCardUtils],
})
export class CreditCardUtilModule {}
