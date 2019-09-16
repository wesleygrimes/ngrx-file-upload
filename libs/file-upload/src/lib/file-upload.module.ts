import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FileUploadComponent],
  exports: [FileUploadComponent]
})
export class FileUploadModule {}
