import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';

export class SetItemDto extends PartialType(CreateItemDto) {}
