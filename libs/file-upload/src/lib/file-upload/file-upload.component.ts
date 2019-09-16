import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  faDownload,
  faTrashAlt,
  faUndo
} from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import {
  UploadFileInputModel,
  UploadStatus
} from '@real-world-app/api-interfaces';
import { FileUploadActions, FileUploadSelectors } from '../state';

@Component({
  selector: 'real-world-app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  uploadQueue$ = this.store.select(FileUploadSelectors.selectAllFileUploads);
  fileCount$ = this.store.select(FileUploadSelectors.selectTotalFilesInQueue);
  faTrashAlt = faTrashAlt;
  faUndo = faUndo;
  faDownload = faDownload;

  constructor(private store: Store<{}>) {}

  async onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.store.dispatch(
          FileUploadActions.enqueueFile({
            fileToUpload: {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              fileContent: (await this.getBase64(file)) as string,
              id: Date.now(),
              error: null,
              progress: null,
              status: UploadStatus.Ready
            }
          })
        );
      }
    }
  }

  openFileDialog(): void {
    this.fileInput.nativeElement.click();
  }

  deleteFile({ id }: UploadFileInputModel) {
    this.store.dispatch(FileUploadActions.removeFileFromQueue({ id }));
  }

  retryUpload({ id }: UploadFileInputModel) {
    this.store.dispatch(FileUploadActions.retryUpload({ id }));
  }

  downloadFile({ id }: UploadFileInputModel) {
    this.store.dispatch(FileUploadActions.downloadFile({ id }));
  }

  uploadFiles() {
    this.store.dispatch(FileUploadActions.processQueue());
  }

  canRetry(file: UploadFileInputModel) {
    return file.status === UploadStatus.Failed;
  }

  canDelete(file: UploadFileInputModel) {
    return file.status !== UploadStatus.Completed;
  }

  canDownload(file: UploadFileInputModel) {
    return file.status === UploadStatus.Completed;
  }

  private getBase64(file: File) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }
}
