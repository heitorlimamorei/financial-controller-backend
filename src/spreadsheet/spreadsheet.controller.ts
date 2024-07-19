import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { SpreadsheetService } from './spreadsheet.service';
import { CreateSpreadsheetDto } from './dto/create-spreadsheet.dto';
import { Response } from 'express';
import { FIndAllPersonalQuery } from './dto/findAll-personal.query.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Personal Spreadsheet')
@Controller('spreadsheet')
export class SpreadsheetController {
  constructor(private readonly spreadsheetService: SpreadsheetService) {}

  @Post('personal')
  async createPersonalSpreadsheet(
    @Body() createSpreadsheetDto: CreateSpreadsheetDto,
  ) {
    return await this.spreadsheetService.createPersonalSpreadsheet(
      createSpreadsheetDto,
    );
  }

  @Get('personal')
  async findAllPersonalSpreadSheet(@Query() query: FIndAllPersonalQuery) {
    if (query?.owid) {
      return await this.spreadsheetService.findOnePersonalSpreadSheetByOwnerId(
        query.owid,
      );
    }
    return await this.spreadsheetService.findAllPersonalSpreadSheet();
  }

  @Get('personal:id')
  async findOnePersonalSpreadSheet(@Param('id') id: string) {
    return await this.spreadsheetService.findOnePersonalSpreadSheet(id);
  }

  @Delete('personal:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.spreadsheetService.removePersonalSpreadSheet(id);
    res.status(200).json({
      message: 'Personal Spreadsheet deleted successfully',
      statusCode: 200,
    });
  }
}
