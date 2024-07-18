import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ItemQueryDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'SheetId must be a string' })
  sheetid: string;

  @ApiPropertyOptional({ required: false })
  @IsString({ message: 'OWID must be a string' })
  @IsOptional()
  owid: string;

  @ApiPropertyOptional({ required: false })
  @IsString({ message: 'Category ID must be a string' })
  @IsOptional()
  categoryId: string;

  @ApiPropertyOptional({ required: false })
  @IsString({ message: 'Account ID must be a string' })
  @IsOptional()
  accountId: string;

  @ApiPropertyOptional({ required: false })
  @IsString({ message: 'Type must be expense or income' })
  @IsOptional()
  type: string;
}
