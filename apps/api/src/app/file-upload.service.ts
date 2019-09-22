import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs';

@Injectable()
export class FileUploadService {
  private UPLOAD_PATH = './tmp';

  async uploadFileAsync(fileName: string, fileContent: string) {
    await writeFile(
      `${this.UPLOAD_PATH}/${fileName}`,
      fileContent,
      { encoding: 'base64' },
      error => {
        throw new Error(`File Upload Error: ${error.message}`);
      }
    );
  }
}
