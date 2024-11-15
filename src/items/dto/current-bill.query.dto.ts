import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CurrentBillQueryDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'SheetId must be a string' })
  sheetid: string;

  @ApiPropertyOptional({ required: true })
  @IsString({ message: 'OWID must be a string' })
  owid: string;

  @ApiPropertyOptional({ required: true })
  @IsString({ message: 'Credit Card ID must be a string' })
  creditCardId: string;
}
