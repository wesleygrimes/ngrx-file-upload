import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  FileUploadModel,
  FileUploadStatus
} from '@real-world-app/shared-models';
import { FileUploadSelectors, FileUploadUIActions } from '../state';

@Component({
  selector: 'real-world-app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  uploadQueue$ = this.store.select(FileUploadSelectors.selectAllFileUploads);
  fileCount$ = this.store.select(FileUploadSelectors.selectTotalFilesInQueue);

  constructor(private store: Store<{}>) {}

  enqueueFile(file: File) {
    const fileToUpload: FileUploadModel = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      rawFile: file,
      id: Date.now(),
      error: null,
      progress: null,
      status: FileUploadStatus.Ready
    };
    this.store.dispatch(FileUploadUIActions.enqueueFile({ fileToUpload }));
  }

  removeFileFromQueue(id: number) {
    this.store.dispatch(FileUploadUIActions.removeFileFromQueue({ id }));
  }

  retryUpload(id: number) {
    this.store.dispatch(FileUploadUIActions.retryUpload({ id }));
  }

  cancelUpload() {
    this.store.dispatch(FileUploadUIActions.cancelUpload());
  }

  uploadFiles() {
    this.store.dispatch(FileUploadUIActions.processQueue());
  }

  clearFiles() {
    this.store.dispatch(FileUploadUIActions.clearQueue());
  }
}
