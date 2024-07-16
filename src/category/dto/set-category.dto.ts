import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

// That dto will be used when the category is going to be toggled to subcategory or the inverse way.
export class SetCategoryDto {
  @ApiPropertyOptional({ required: false })
  @IsString({ message: 'Category must be a string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ required: false })
  @IsString({ message: 'Main category id must be a string' })
  @IsOptional()
  mainCategoryId?: string;

  @ApiPropertyOptional({ required: false })
  @IsString({ message: 'Image path must be a string' })
  @IsOptional()
  image_path: string;

  @ApiProperty({ required: true })
  @IsIn(['category', 'subcategory'], {
    message: 'Category type must be category or subcategory',
  })
  type: string;
}
