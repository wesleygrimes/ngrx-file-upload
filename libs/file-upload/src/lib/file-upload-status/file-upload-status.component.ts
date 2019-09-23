import { Component, Input } from '@angular/core';
import {
  faCheck,
  faCircleNotch,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  FileUploadModel,
  FileUploadStatus
} from '@real-world-app/shared-models';

@Component({
  selector: 'real-world-app-file-upload-status',
  templateUrl: './file-upload-status.component.html',
  styleUrls: ['./file-upload-status.component.css']
})
export class FileUploadStatusComponent {
  @Input() file: FileUploadModel;

  get icon() {
    switch (this.file.status) {
      case FileUploadStatus.InProgress:
        return faCircleNotch;
      case FileUploadStatus.Completed:
        return faCheck;
      case FileUploadStatus.Failed:
        return faExclamationCircle;
      default:
        return null;
    }
  }

  get colorClass() {
    switch (this.file.status) {
      case FileUploadStatus.Completed:
        return 'green';
      case FileUploadStatus.Failed:
        return 'red';
      default:
        return 'black';
    }
  }

  get spin() {
    return this.file.status === FileUploadStatus.InProgress;
  }

  get errorMessage() {
    return (
      (this.file.status === FileUploadStatus.Failed && this.file.error) || null
    );
  }
}
