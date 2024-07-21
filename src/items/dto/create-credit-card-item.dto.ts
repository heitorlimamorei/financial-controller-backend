import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateCreditCardItemDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'The sheetId must be a string' })
  sheetId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'The OwnerId must be a string' })
  ownerId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'The name must be a string' })
  name: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'The description must be a string' })
  description: string;

  @ApiProperty({ required: true })
  @IsNumber({}, { message: 'The parcellsNumber must be a number' })
  parcellsNumber: number;

  @ApiProperty({ required: true })
  @IsNumber({}, { message: 'The interest must be a number' })
  interest: number;

  @ApiProperty({ required: true })
  @IsString({ message: 'The creditCardId must be a string' })
  creditCardId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'The categoryId must be a string' })
  categoryId: string;

  @ApiProperty({ required: true })
  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @ApiProperty({ required: true })
  @IsDateString({}, { message: 'Date must be a string in ISO 8601 format' })
  date: string;
}
