import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FileUploadService } from './services';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  exports: [FileUploadService],
  providers: [FileUploadService]
})
export class FileUploadDataAccessModule {}
