import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCreditCardItemDto {
  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString({ message: 'The name must be a string' })
  name: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString({ message: 'The description must be a string' })
  description: string;

  @ApiPropertyOptional({ required: false })
  @IsNumber({}, { message: 'The parcellsNumber must be a number' })
  @IsOptional()
  parcellsNumber: number;

  @ApiPropertyOptional({ required: false })
  @IsNumber({}, { message: 'The interest must be a number' })
  @IsOptional()
  interest: number;

  @ApiProperty({ required: true })
  @IsNumber({}, { message: 'The amount must be a number' })
  amount: number;

  @ApiPropertyOptional({ required: false })
  @IsNumber({}, { message: 'The currentParcell must be a number' })
  @IsOptional()
  currentParcell: number;

  @ApiPropertyOptional({ required: false })
  @IsString({ message: 'The categoryId must be a string' })
  @IsOptional()
  categoryId: string;

  @ApiPropertyOptional({ required: false })
  @IsDateString({}, { message: 'Date must be a string in ISO 8601 format' })
  @IsOptional()
  date: string;
}
