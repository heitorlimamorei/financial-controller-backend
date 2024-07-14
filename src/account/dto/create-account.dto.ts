import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'The ownerid must be a string' })
  ownerId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'The financial institution must be a string' })
  financial_institution: string;

  @ApiProperty({ required: true })
  @IsNumber({}, { message: 'The initial balance must be a number' })
  balance: number;
}
