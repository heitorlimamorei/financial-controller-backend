import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpException,
  Put,
  Res,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return await this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  async findAll(@Query('owid') owid: string) {
    return await this.subscriptionService.findAll(owid);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('owid') owid: string) {
    return await this.subscriptionService.findOne(id, owid);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @Res() res: Response,
  ) {
    if (!updateSubscriptionDto.ownerId) {
      throw new HttpException(
        'SERVICE: ownerId is required to update a subscription',
        400,
      );
    }
    await this.subscriptionService.update(id, updateSubscriptionDto);
    res.status(200).json({
      message: 'Subscription updated successfully',
      statusCode: 200,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('owid') owid: string,
    @Res() res: Response,
  ) {
    await this.subscriptionService.remove(id, owid);
    res.status(200).json({
      message: 'Subscription deleted successfully',
      statusCode: 200,
    });
  }
}
