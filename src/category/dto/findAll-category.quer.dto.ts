import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export default class findAllCategoryQueryDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'SheetId must be a string' })
  sheetId: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  categoryId: string;
}
