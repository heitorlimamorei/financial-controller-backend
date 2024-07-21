import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreditCardItemQueryDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'SheetId must be a string' })
  sheetid: string;

  @ApiPropertyOptional({ required: false })
  @IsString({ message: 'Category ID must be a string' })
  @IsOptional()
  categoryId: string;

  @ApiPropertyOptional({ required: false })
  @IsString({ message: 'Credit Card ID must be a string' })
  @IsOptional()
  creditCardId: string;
}

export class UpdateCreditCardItemQueryDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'SheetId must be a string' })
  sheetid: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Credit Card ID must be a string' })
  creditCardId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Owid must be a string' })
  owid: string;
}
