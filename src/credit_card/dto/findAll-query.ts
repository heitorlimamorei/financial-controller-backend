import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindAllCreditCardQuey {
  @ApiProperty()
  @IsString({ message: 'Owner ID is required and must be a string' })
  owid: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Financial Institution must be a string' })
  @IsOptional()
  financial_institution: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Card flag must be a string' })
  @IsOptional()
  flag: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Card number must be a string' })
  @IsOptional()
  card_number: string;
}
