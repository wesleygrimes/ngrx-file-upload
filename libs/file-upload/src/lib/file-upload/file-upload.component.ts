import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FileUploadModel } from '@real-world-app/shared-models';
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

  enqueueFile(fileToUpload: FileUploadModel) {
    this.store.dispatch(FileUploadActions.enqueueFile({ fileToUpload }));
  }

  removeFileFromQueue({ id }: FileUploadModel) {
    this.store.dispatch(FileUploadActions.removeFileFromQueue({ id }));
  }

  retryUpload({ id }: FileUploadModel) {
    this.store.dispatch(FileUploadActions.retryUpload({ id }));
  }

  uploadFiles() {
    this.store.dispatch(FileUploadActions.processQueue());
  }
}
