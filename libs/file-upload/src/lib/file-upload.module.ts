import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FileUploadFormComponent } from './file-upload-form/file-upload-form.component';
import { FileUploadListComponent } from './file-upload-list/file-upload-list.component';
import { FileUploadStatusComponent } from './file-upload-status/file-upload-status.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileSizePipe } from './pipes';
import { FileUploadEffects, fileUploadFeatureKey, reducer } from './state';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbProgressbarModule,
    StoreModule.forFeature(fileUploadFeatureKey, reducer),
    EffectsModule.forFeature([FileUploadEffects])
  ],
  declarations: [
    FileUploadComponent,
    FileSizePipe,
    FileUploadStatusComponent,
    FileUploadListComponent,
    FileUploadFormComponent
  ],
  exports: [FileUploadComponent]
})
export class FileUploadModule {}
