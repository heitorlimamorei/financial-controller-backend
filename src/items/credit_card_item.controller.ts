import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreditCardItemService } from './credit_card_item.service';
import { CreateCreditCardItemDto } from './dto/create-credit-card-item.dto';
import { IQuery } from 'src/shared/providers/firebase/types/firebase.api.types';
import { ICreditCardItem } from './items.types';
import { CreditCardItemQueryDto } from './dto/credit-card-item-query.dto';
import { Response } from 'express';
import { UpdateCreditCardItemDto } from './dto/update-credit-card-item.dto';
import { UpdateCreditCardItemQueryDto } from './dto/credit-card-item-query.dto';

@ApiTags('Credit Card Items')
@Controller('credit_card_items')
export class CreditCardItemController {
  constructor(private readonly creditCardItemsService: CreditCardItemService) {}

  @Post()
  async create(@Body() createCreditCardItemDto: CreateCreditCardItemDto) {
    return await this.creditCardItemsService.create(createCreditCardItemDto);
  }

  @Get()
  async findAll(@Query() query: CreditCardItemQueryDto) {
    const queries: IQuery<ICreditCardItem>[] = Object.entries(query)
      .filter((c) => c[0] !== 'sheetid')
      .map((c) => {
        const [field, value] = c;
        return {
          field,
          condition: '==',
          value,
        };
      });

    if (queries.length == 0) {
      return await this.creditCardItemsService.findAll(query.sheetid);
    }

    return await this.creditCardItemsService.findAllByQueries(
      query.sheetid,
      queries,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('sheetid') sheetId: string) {
    return await this.creditCardItemsService.findOne(id, sheetId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Query() query: UpdateCreditCardItemQueryDto,
    @Body() updateItemDto: UpdateCreditCardItemDto,
    @Res() res: Response,
  ) {
    await this.creditCardItemsService.update(
      id,
      query.sheetid,
      query.creditCardId,
      query.owid,
      updateItemDto,
    );
    res.status(200).json({
      message: 'Item updated successfully',
      statusCode: 200,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('sheetid') sheetId: string,
    @Res() res: Response,
  ) {
    await this.creditCardItemsService.remove(id, sheetId);
    res.status(200).json({
      message: 'Item deleted successfully',
      statusCode: 200,
    });
  }
}
