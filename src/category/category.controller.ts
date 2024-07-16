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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SetCategoryDto } from './dto/set-category.dto';
import findAllCategoryQueryDto from './dto/findAll-category.quer.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(@Query() query: findAllCategoryQueryDto) {
    if (query.categoryId) {
      return await this.categoryService.findAllSubcategories(
        query.sheetId,
        query.categoryId,
      );
    }
    return await this.categoryService.findAll(query.sheetId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('sheetid') sheetId: string) {
    return await this.categoryService.findOne(sheetId, id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Query('sheetid') sheetId: string,
    @Res() res: Response,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.categoryService.update(sheetId, id, updateCategoryDto);
    res.status(200).json({
      message: 'Category updated successfully',
      statusCode: 200,
    });
  }

  @Patch(':id')
  async setCategory(
    @Param('id') id: string,
    @Query('sheetid') sheetId: string,
    @Res() res: Response,
    @Body() setCategoryDto: SetCategoryDto,
  ) {
    await this.categoryService.setCategory(sheetId, id, setCategoryDto);
    res.status(200).json({
      message: 'Category updated (set) successfully',
      statusCode: 200,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('sheetid') sheetId: string,
    @Res() res: Response,
  ) {
    await this.categoryService.remove(sheetId, id);
    res.status(200).json({
      message: 'Category deleted successfully',
      statusCode: 200,
    });
  }
}
