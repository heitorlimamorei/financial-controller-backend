import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'Nickname must be a string' })
  nickname: string;

  @ApiPropertyOptional()
  @IsNumber({}, { message: 'Balance must be a number' })
  balance?: number;
}
