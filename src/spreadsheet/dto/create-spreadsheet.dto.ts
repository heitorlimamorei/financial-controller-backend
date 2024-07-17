import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSpreadsheetDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'OwnerId must be a string' })
  ownerId: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'Name must be a string' })
  name: string;
}
