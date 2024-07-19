import { HttpException, Injectable } from '@nestjs/common';
import { CreateSpreadsheetDto } from './dto/create-spreadsheet.dto';
import { FirebaseImplementation } from 'src/shared/providers/firebase/implementation';
import { IPersonalSpreadSheet } from './spreadsheet.types';

@Injectable()
export class SpreadsheetService {
  constructor(private readonly firebaseService: FirebaseImplementation) {}

  async createPersonalSpreadsheet(
    createSpreadsheetDto: CreateSpreadsheetDto,
  ): Promise<string> {
    const resp = await this.firebaseService.Create({
      collection: 'sheets',
      payload: {
        ...createSpreadsheetDto,
        type: 'PERSONAL',
      },
    });

    if (!resp) {
      throw new HttpException('SERVICE: Falied to create spreadsheet.', 400);
    }

    return resp;
  }

  async findAllPersonalSpreadSheet(): Promise<IPersonalSpreadSheet[]> {
    const resp = await this.firebaseService.findAll<IPersonalSpreadSheet>({
      collection: 'sheets',
      query: [
        {
          field: 'type',
          condition: '==',
          value: 'PERSONAL',
        },
      ],
    });

    if (resp.length == 0) {
      throw new HttpException('SERVICE: Failed to find spreadsheets.', 404);
    }

    return resp;
  }

  async findOnePersonalSpreadSheet(id: string): Promise<IPersonalSpreadSheet> {
    const resp = await this.firebaseService.findOne<IPersonalSpreadSheet>({
      collection: 'sheets',
      id,
    });

    if (!resp) {
      throw new HttpException('SERVICE: Failed to find spreadsheet.', 404);
    }

    return resp;
  }

  async findOnePersonalSpreadSheetByOwnerId(
    ownerId: string,
  ): Promise<IPersonalSpreadSheet> {
    const resp = await this.firebaseService.findOne<IPersonalSpreadSheet>({
      collection: 'sheets',
      query: [
        {
          field: 'ownerId',
          condition: '==',
          value: ownerId,
        },
        {
          field: 'type',
          condition: '==',
          value: 'PERSONAL',
        },
      ],
    });

    if (!resp) {
      throw new HttpException('SERVICE: Failed to find spreadsheet.', 404);
    }

    return resp;
  }

  async removePersonalSpreadSheet(id: string) {
    await this.firebaseService.DeleteOne({
      collection: 'sheets',
      id,
    });
  }
}
