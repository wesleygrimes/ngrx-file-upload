import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { wait } from './app.utils';

@Injectable()
export class AppService {
  private UPLOAD_PATH = './tmp';

  async uploadFileAsync(fileName: string, fileContent: string) {
    await wait();
    writeFileSync(`${this.UPLOAD_PATH}/${fileName}`, fileContent, {
      encoding: 'base64'
    });
  }
}
