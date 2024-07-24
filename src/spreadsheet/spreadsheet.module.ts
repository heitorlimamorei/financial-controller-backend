import { Module } from '@nestjs/common';
import { SpreadsheetService } from './spreadsheet.service';
import { SpreadsheetController } from './spreadsheet.controller';
import { FirebaseModule } from 'src/shared/providers/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [SpreadsheetController],
  providers: [SpreadsheetService],
  exports: [SpreadsheetService],
})
export class SpreadsheetModule {}
