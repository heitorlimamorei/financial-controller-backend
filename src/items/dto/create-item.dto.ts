import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNumber, IsString } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'SheetId must be a string' })
  sheetId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'CategoryId must be a string' })
  categoryId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'OwnerId must be a string' })
  ownerId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'AccountId must be a string' })
  accountId: string;

  @ApiProperty({ required: true })
  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @ApiProperty({ required: true })
  @IsDateString({}, { message: 'Date must be a string in ISO 8601 format' })
  date: string;

  @ApiProperty({ required: true })
  @IsIn(['INCOME', 'EXPENSE'], { message: 'Type must be INCOME or EXPENSE' })
  type: 'INCOME' | 'EXPENSE';
}
