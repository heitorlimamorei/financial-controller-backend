import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CrateBillDto {
  @ApiProperty()
  @IsString({ message: 'CreditCardId must be defined and be a string' })
  creditCardId: string;

  @ApiProperty()
  @IsString({ message: 'SheetId must be defined and be a string' })
  sheetId: string;

  @ApiProperty()
  @IsString({ message: 'Owid must be defined and be a string' })
  owid: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Total must be defined and be a number' })
  total: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  ids: string[];

  @ApiProperty()
  @IsString({ message: 'Resume must be defined and be a string' })
  resume: string;
}
