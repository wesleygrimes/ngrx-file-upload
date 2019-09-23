import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  faDownload,
  faTimesCircle,
  faTrashAlt,
  faUndo
} from '@fortawesome/free-solid-svg-icons';
import {
  FileUploadModel,
  FileUploadStatus
} from '@real-world-app/shared-models';
@Component({
  selector: 'real-world-app-file-upload-list',
  templateUrl: './file-upload-list.component.html',
  styleUrls: ['./file-upload-list.component.css']
})
export class FileUploadListComponent implements OnInit {
  @Input() files: FileUploadModel[];
  @Output() remove = new EventEmitter<number>();
  @Output() retry = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<number>();

  faTrashAlt = faTrashAlt;
  faUndo = faUndo;
  faDownload = faDownload;
  faTimesCircle = faTimesCircle;

  ngOnInit() {}

  canCancel(file: FileUploadModel) {
    return file.status === FileUploadStatus.InProgress;
  }

  canRetry(file: FileUploadModel) {
    return file.status === FileUploadStatus.Failed;
  }

  canDelete(file: FileUploadModel) {
    return file.status !== FileUploadStatus.Completed;
  }

  canDownload(file: FileUploadModel) {
    return file.status === FileUploadStatus.Completed;
  }

  removeFileFromQueue({ id }: FileUploadModel) {
    this.remove.emit(id);
  }

  retryUpload({ id }: FileUploadModel) {
    this.retry.emit(id);
  }

  cancelUpload({ id }: FileUploadModel) {
    this.cancel.emit(id);
  }
}
