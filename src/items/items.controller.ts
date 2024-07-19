import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  Put,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { SetItemDto } from './dto/set-item.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ItemQueryDto } from './dto/item-query.dto';
import { IQuery } from 'src/shared/providers/firebase/types/firebase.api.types';
import { IItem } from './items.types';
import { UpdateItemDto } from './dto/update-item.dto';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    return await this.itemsService.create(createItemDto);
  }

  @Get()
  async findAll(@Query() query: ItemQueryDto) {
    const queries: IQuery<IItem>[] = Object.entries(query)
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
      return await this.itemsService.findAll(query.sheetid);
    }

    return await this.itemsService.findAllByQueries(query.sheetid, queries);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('sheetid') sheetId: string) {
    return await this.itemsService.findOne(id, sheetId);
  }

  @Patch(':id')
  async setItem(
    @Param('id') id: string,
    @Query('sheetid') sheetId: string,
    @Body() setItemDto: SetItemDto,
    @Res() res: Response,
  ) {
    await this.itemsService.setItem(id, sheetId, setItemDto);
    res.status(200).json({
      message: 'Item updated (set) successfully',
      statusCode: 200,
    });
  }

  @Put()
  async update(
    @Param('id') id: string,
    @Query('sheetid') sheetId: string,
    @Body() updateItemDto: UpdateItemDto,
    @Res() res: Response,
  ) {
    await this.itemsService.update(id, sheetId, updateItemDto);
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
    await this.itemsService.remove(id, sheetId);
    res.status(200).json({
      message: 'Item deleted successfully',
      statusCode: 200,
    });
  }
}
