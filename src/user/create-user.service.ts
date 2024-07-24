import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { SpreadsheetService } from 'src/spreadsheet/spreadsheet.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class CreateUseService {
  constructor(
    private readonly userSvc: UserService,
    private readonly spreadSheetSvc: SpreadsheetService,
  ) {}

  async execute(newUserDto: CreateUserDto): Promise<string> {
    const resp = await this.userSvc.create(newUserDto);

    const spreadSheetId = await this.spreadSheetSvc.createPersonalSpreadsheet({
      ownerId: resp.id,
      name: `${newUserDto.name}'s Personal Spreadsheet`,
    });

    await this.userSvc.setPersonalSpreadSheet(resp.id, spreadSheetId);

    return resp.id;
  }
}
