import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  faDownload,
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

  faTrashAlt = faTrashAlt;
  faUndo = faUndo;
  faDownload = faDownload;

  ngOnInit() {}

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
}
