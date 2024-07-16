import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'Category must be a string' })
  name: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Image path must be a string' })
  image_path: string;
}
