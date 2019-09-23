import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post
} from '@nestjs/common';
import { FileUploadModel } from '@real-world-app/shared-models';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private service: AppService) {}

  @Post('uploadFile')
  @HttpCode(200)
  async uploadFile(@Body() model: FileUploadModel) {
    try {
      await this.service.uploadFileAsync(model.fileName, model.fileContent);
    } catch (error) {
      throw new BadRequestException(`Failed to upload file. ${error}`);
    }
  }
}
