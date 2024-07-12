import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCreditCardDto } from './create-credit_card.dto';
import { IsNumber } from 'class-validator';

export class UpdateCreditCardDto extends PartialType(CreateCreditCardDto) {
  @ApiProperty()
  @IsNumber({}, { message: 'Available Limit must be a number' })
  availableLimit: number;
}
