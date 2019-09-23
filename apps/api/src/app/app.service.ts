import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { wait } from './app.utils';

@Injectable()
export class AppService {
  private UPLOAD_PATH = './tmp';

  async uploadFileAsync(name: string, contents: Buffer) {
    await wait();
    writeFileSync(`${this.UPLOAD_PATH}/${name}`, contents);
  }
}
