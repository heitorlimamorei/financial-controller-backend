import { Injectable } from '@nestjs/common';
import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';
import { Buffer } from 'buffer';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

@Injectable()
export class TextCompressionService {
  // returns a base64 encoded string
  async compressText(text: string): Promise<string> {
    const buffer = Buffer.from(text, 'utf-8');
    const compressedBuffer = await gzipAsync(buffer);
    return compressedBuffer.toString('base64');
  }

  async decompressText(compressed: string): Promise<string> {
    const buffer = Buffer.from(compressed, 'base64');
    const decompressedBuffer = await gunzipAsync(buffer);
    return decompressedBuffer.toString('utf-8');
  }
}
