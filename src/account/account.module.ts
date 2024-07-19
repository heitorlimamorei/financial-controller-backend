import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { FirebaseModule } from 'src/shared/providers/firebase/firebase.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [FirebaseModule, UserModule],
  exports: [AccountService],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
