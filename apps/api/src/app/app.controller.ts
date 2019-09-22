import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post
} from '@nestjs/common';
import { UploadFileInputModel } from '@real-world-app/api-interfaces';
import { FileUploadService } from './file-upload.service';
@Controller()
export class AppController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post('uploadFile')
  @HttpCode(200)
  async uploadFile(@Body() model: UploadFileInputModel) {
    try {
      await this.fileUploadService.uploadFileAsync(
        model.fileName,
        model.fileContent
      );
    } catch (error) {
      throw new BadRequestException(`Failed to upload file. ${error}`);
    }
  }
}
