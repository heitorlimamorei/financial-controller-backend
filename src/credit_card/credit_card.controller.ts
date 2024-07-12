import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
} from '@nestjs/common';
import { CreditCardService } from './credit_card.service';
import { CreateCreditCardDto } from './dto/create-credit_card.dto';
import { UpdateCreditCardDto } from './dto/update-credit_card.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindAllCreditCardQuey } from './dto/findAll-query';

@ApiTags('Credit Card')
@Controller('credit-card')
export class CreditCardController {
  constructor(private readonly creditCardService: CreditCardService) {}

  @Post()
  async create(@Body() createCreditCardDto: CreateCreditCardDto) {
    return await this.creditCardService.create(createCreditCardDto);
  }

  @Get()
  async findAll(@Query() query: FindAllCreditCardQuey) {
    if (query.card_number) {
      return await this.creditCardService.findOneByCardNumber(
        query.owid,
        query.card_number,
      );
    }

    if (query.flag) {
      if (
        query.flag !== 'mastercard' &&
        query.flag !== 'elo' &&
        query.flag !== 'visa'
      ) {
        throw new HttpException('Invalid card brand provided', 400);
      }
      return await this.creditCardService.findAllByFlag(query.owid, query.flag);
    }

    return await this.creditCardService.findAll(query.owid);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('owid') owid: string) {
    return await this.creditCardService.findOne(owid, id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCreditCardDto: UpdateCreditCardDto,
  ) {
    if (!updateCreditCardDto.ownerId) {
      throw new HttpException(
        'ownerId is required to update a credit card',
        400,
      );
    }
    return await this.creditCardService.update(id, updateCreditCardDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('owid') owid: string) {
    return await this.creditCardService.remove(owid, id);
  }
}
