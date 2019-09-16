import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileSizePipe } from './pipes';
import { FileUploadEffects, fileUploadFeatureKey, reducer } from './state';
import { UploadStatusIndicatorComponent } from './upload-status-indicator/upload-status-indicator.component';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    StoreModule.forFeature(fileUploadFeatureKey, reducer),
    EffectsModule.forFeature([FileUploadEffects])
  ],
  declarations: [FileUploadComponent, FileSizePipe, UploadStatusIndicatorComponent],
  exports: [FileUploadComponent]
})
export class FileUploadModule {}
