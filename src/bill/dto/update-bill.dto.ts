import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateBillDto {
  @ApiProperty()
  @IsString({ message: 'Resume must be a string' })
  resume: string;
}
