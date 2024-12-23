import { Module } from '@nestjs/common';
import { TextCompressionService } from './compression/compression.service';

@Module({
  providers: [TextCompressionService],
  exports: [TextCompressionService],
})
export class TextcompressionModule {}
