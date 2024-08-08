import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNumber, IsString } from 'class-validator';

export class CreateRecurringItemDto {
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
  @IsDateString(
    {},
    { message: 'Start Date  must be a json date ISO and be defined' },
  )
  startDate: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'CategoryId must be a string and be defined' })
  categoryId: string;

  @ApiProperty({ required: true })
  @IsIn(['credit-card', 'account'], {
    message: 'PaymentMethod must credit-card or account',
  })
  paymentMethod: 'credit-card' | 'account';

  @ApiProperty({ required: true })
  @IsString({ message: 'Payment method ID must be a string and be defined' })
  paymentMethodId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'SheetId must be a string and be defined' })
  sheetId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Owid must be a string and be defined' })
  owid: string;
}
