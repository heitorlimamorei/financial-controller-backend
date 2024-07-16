import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  Res,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import updateBalanceDto from './dto/update-balance.dto';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return await this.accountService.create(createAccountDto);
  }

  @Get()
  async findAll(@Query('owid') owid: string) {
    return await this.accountService.findAll(owid);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('owid') owid: string) {
    return await this.accountService.findOne(id, owid);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Query('owid') owid: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @Res() res: Response,
  ) {
    await this.accountService.update(id, owid, updateAccountDto);

    res.status(200).json({
      message: 'Account updated successfully',
      statusCode: 200,
    });
  }

  @Patch(':id/balance/increase')
  async increaseBalance(
    @Param('id') id: string,
    @Query('owid') owid: string,
    @Body() updateBalanceDto: updateBalanceDto,
    @Res() res: Response,
  ) {
    await this.accountService.increaseBalance(
      id,
      owid,
      updateBalanceDto.ammount,
    );

    res.status(200).json({
      message: 'Account balance updated successfully',
      statusCode: 200,
    });
  }

  @Patch(':id/balance/decrease')
  async updateBalance(
    @Param('id') id: string,
    @Query('owid') owid: string,
    @Body() updateBalanceDto: updateBalanceDto,
    @Res() res: Response,
  ) {
    await this.accountService.decreaseBalance(
      id,
      owid,
      updateBalanceDto.ammount,
    );

    res.status(200).json({
      message: 'Account balance updated successfully',
      statusCode: 200,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('owid') owid: string,
    @Res() res: Response,
  ) {
    await this.accountService.remove(id, owid);
    res.status(200).json({
      message: 'Account deleted successfully',
      statusCode: 200,
    });
  }
}
