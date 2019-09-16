import { Component, Input } from '@angular/core';
import {
  faCheck,
  faCircleNotch,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  UploadFileInputModel,
  UploadStatus
} from '@real-world-app/api-interfaces';

@Component({
  selector: 'real-world-app-upload-status-indicator',
  templateUrl: './upload-status-indicator.component.html',
  styleUrls: ['./upload-status-indicator.component.css']
})
export class UploadStatusIndicatorComponent {
  @Input() file: UploadFileInputModel;

  get icon() {
    switch (this.file.status) {
      case UploadStatus.InProgress:
        return faCircleNotch;
      case UploadStatus.Completed:
        return faCheck;
      case UploadStatus.Failed:
        return faExclamationCircle;
      default:
        return null;
    }
  }

  get colorClass() {
    switch (this.file.status) {
      case UploadStatus.Completed:
        return 'green';
      case UploadStatus.Failed:
        return 'red';
      default:
        return 'black';
    }
  }

  get spin() {
    return this.file.status === UploadStatus.InProgress;
  }

  get errorMessage() {
    return (
      (this.file.status === UploadStatus.Failed && this.file.error) || null
    );
  }
}
