import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export default class updateBalanceDto {
  @ApiProperty({ required: true })
  @IsNumber({}, { message: 'The amount to increase must be a number' })
  ammount: number;
}
