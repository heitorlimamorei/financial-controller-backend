import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'SheetId must be a string' })
  sheetId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Category must be a string' })
  name: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'OwnerId must be a string' })
  ownerId: string;

  @ApiProperty({ required: true })
  @IsIn(['category', 'subcategory'], {
    message: 'Category type must be category or subcategory',
  })
  type: string;

  @ApiPropertyOptional({ required: false })
  @IsString({ message: 'Main category id must be a string' })
  @IsOptional()
  mainCategoryId?: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Image path must be a string' })
  image_path: string;
}
