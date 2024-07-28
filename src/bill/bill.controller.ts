import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CloseBillDto } from './dto/close-bill.dto';
import { ClonseBillService } from './close-bill.service';
import { ApiTags } from '@nestjs/swagger';
import { CrateBillDto } from './dto/create-bill.dto';
import { BillService } from './bill.service';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Response } from 'express';

@ApiTags('Bill')
@Controller('bill')
export class BillController {
  constructor(
    private readonly closeBillSvc: ClonseBillService,
    private readonly billService: BillService,
  ) {}

  @Post('close-bill')
  async closeBill(@Body() body: CloseBillDto) {
    return await this.closeBillSvc.execute(
      body.sheetid,
      body.owid,
      body.creditCardId,
    );
  }

  @Post()
  async create(@Body() createBillDto: CrateBillDto) {
    return await this.billService.create(createBillDto);
  }

  @Get()
  async findAll(
    @Query('owid') owid: string,
    @Query('creditCardId') creditCardId: string,
  ) {
    return await this.billService.findAll(owid, creditCardId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('owid') owid: string) {
    return await this.billService.findOne(owid, id);
  }

  @Patch(':id/resume')
  async updateResume(
    @Param('id') id: string,
    @Query('owid') owid: string,
    @Body() updateBillDto: UpdateBillDto,
    @Res() res: Response,
  ) {
    await this.billService.updateResume(owid, id, updateBillDto.resume);

    res.status(200).json({
      message: 'Bill resume updated successfully',
      statusCode: 200,
    });
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Query('owid') owid: string,
    @Res() res: Response,
  ) {
    await this.billService.delete(owid, id);

    res.status(200).json({
      message: 'Bill deleted successfully',
      statusCode: 200,
    });
  }
}
