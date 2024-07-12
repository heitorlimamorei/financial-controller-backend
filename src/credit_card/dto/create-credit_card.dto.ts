import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateCreditCardDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'The Nickname must be a string' })
  ownerId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'The Nickname must be a string' })
  nickname: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'The card number must be a string' })
  cardNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({
    message: 'The card flag(visa, mastercard, elo) must be a string',
  })
  flag: string;

  @ApiProperty({ required: true })
  @IsDateString({}, { message: 'The expiration date must be a json date' })
  expirationDate: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'The financial nstitution code must be a string' })
  financialInstitution: string;

  @ApiProperty({ required: true })
  @IsNumber({}, { message: 'The speeding limit must be a number' })
  speendingLimit: number;
}
