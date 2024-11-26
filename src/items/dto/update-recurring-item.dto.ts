import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateRecurringItemDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'Name must be a string and be defined' })
  name: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Description must be a string and be defined' })
  description: string;

  @ApiProperty({ required: true })
  @IsNumber({}, { message: 'Amount must be a number and be defined' })
  amount: number;

  @ApiProperty({ required: true })
  @IsNumber({}, { message: 'Frequency must be a number and be defined' })
  frequency: number;

  @ApiProperty({ required: true })
  @IsString({ message: 'CategoryId must be a string and be defined' })
  categoryId: string;
}
