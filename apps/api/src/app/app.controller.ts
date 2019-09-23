import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFileSync } from 'fs';
import { from } from 'rxjs';
import { delay } from 'rxjs/operators';

@Controller()
export class AppController {
  private UPLOAD_PATH = './tmp';
  constructor() {}

  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile()
  file: {
    originalname: string;
    buffer: Buffer;
  }) {
    try {
      await from([])
        .pipe(delay(2000))
        .toPromise();
      writeFileSync(`${this.UPLOAD_PATH}/${file.originalname}`, file.buffer);
    } catch (error) {
      throw new BadRequestException(`Failed to upload file. ${error}`);
    }
  }
}
