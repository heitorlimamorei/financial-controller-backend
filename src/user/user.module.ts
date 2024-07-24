import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FirebaseModule } from 'src/shared/providers/firebase/firebase.module';
import { SpreadsheetService } from 'src/spreadsheet/spreadsheet.service';
import { CreateUseService } from './create-user.service';

@Module({
  imports: [FirebaseModule, SpreadsheetService],
  controllers: [UserController],
  providers: [UserService, CreateUseService],
  exports: [UserService],
})
export class UserModule {}
