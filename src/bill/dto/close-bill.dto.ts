import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CloseBillDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'CreditCardId must be a string' })
  creditCardId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'SheetId must be a string' })
  sheetid: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Owid must be a string' })
  owid: string;
}
