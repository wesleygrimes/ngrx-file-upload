import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FileUploadService } from './file-upload.service';
@Module({
  controllers: [AppController],
  providers: [FileUploadService]
})
export class AppModule {}
