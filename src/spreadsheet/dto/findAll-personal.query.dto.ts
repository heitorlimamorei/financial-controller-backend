import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FIndAllPersonalQuery {
  @ApiPropertyOptional({ required: false })
  @IsOptional()
  owid: string;
}
