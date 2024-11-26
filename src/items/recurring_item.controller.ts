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
import { ApiTags } from '@nestjs/swagger';
import { RecurringIemService } from './recurring_item.service';
import { CreateRecurringItemDto } from './dto/create-recurring-item.dto';
import { Response } from 'express';
import { UpdateRecurringItemDto } from './dto/update-recurring-item.dto';

@ApiTags('Recurring Item')
@Controller('recurring-items')
export class RecurringItemController {
  constructor(private readonly recurringItemsService: RecurringIemService) {}

  @Post()
  async create(@Body() recurringExpenseDto: CreateRecurringItemDto) {
    return await this.recurringItemsService.create(recurringExpenseDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Query('sheetid') sheetId: string,
    @Body() updatedFields: UpdateRecurringItemDto,
    @Res() res: Response,
  ) {
    await this.recurringItemsService.updateOne(sheetId, id, updatedFields);
    res.status(200).json({
      message: 'Item updated successfully',
      statusCode: 200,
    });
  }

  @Post('check-recurring-items')
  async checkRecurringItems(@Query('sheetid') sheetId: string) {
    const charges =
      await this.recurringItemsService.executeGlobalCharge(sheetId);
    return charges;
  }

  @Get()
  async findAll(@Query('sheetid') sheetId: string) {
    return await this.recurringItemsService.findAll(sheetId);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Query('sheetid') sheetId: string,
    @Res() res: Response,
  ) {
    await this.recurringItemsService.delete(sheetId, id);
    res.status(200).json({
      message: 'Item deleted successfully',
      statusCode: 200,
    });
  }
}
