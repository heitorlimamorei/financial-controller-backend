import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FirebaseModule } from 'src/shared/providers/firebase/firebase.module';
import { CreateUseService } from './create-user.service';
import { SpreadsheetModule } from 'src/spreadsheet/spreadsheet.module';

@Module({
  imports: [FirebaseModule, SpreadsheetModule],
  controllers: [UserController],
  providers: [UserService, CreateUseService],
  exports: [UserService],
})
export class UserModule {}
