import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'OwnerId is required to create a subscription' })
  ownerId: string;

  @ApiProperty({ required: true })
  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  @ApiProperty({ required: true })
  @IsString({ message: 'Type must be a string' })
  type: string;

  @ApiProperty({ required: true })
  @IsDateString({}, { message: 'Start date must be a date' })
  start_date: string;

  @ApiProperty({ required: true })
  @IsDateString({}, { message: 'Start date must be a date' })
  end_date: string;
}
