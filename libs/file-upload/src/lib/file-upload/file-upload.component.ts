import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  FileUploadModel,
  FileUploadStatus
} from '@real-world-app/shared-models';
import { FileUploadActions, FileUploadSelectors } from '../state';

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
    this.store.dispatch(FileUploadActions.enqueueFile({ fileToUpload }));
  }

  removeFileFromQueue(id: number) {
    this.store.dispatch(FileUploadActions.removeFileFromQueue({ id }));
  }

  retryUpload(id: number) {
    this.store.dispatch(FileUploadActions.retryUpload({ id }));
  }

  uploadFiles() {
    this.store.dispatch(FileUploadActions.processQueue());
  }

  clearFiles() {
    this.store.dispatch(FileUploadActions.clearQueue());
  }
}
