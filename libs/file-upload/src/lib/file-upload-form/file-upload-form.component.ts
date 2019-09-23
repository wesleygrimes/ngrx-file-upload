import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import {
  FileUploadModel,
  FileUploadStatus
} from '@real-world-app/shared-models';

@Component({
  selector: 'real-world-app-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.css']
})
export class FileUploadFormComponent {
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;

  @Output() fileAdded = new EventEmitter<FileUploadModel>();
  @Output() upload = new EventEmitter();
  @Output() clear = new EventEmitter();

  openFileDialog(): void {
    this.fileInput.nativeElement.click();
  }

  async onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileToUpload: FileUploadModel = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileContent: (await this.getBase64(file)) as string,
          id: Date.now(),
          error: null,
          progress: null,
          status: FileUploadStatus.Ready
        };
        this.fileAdded.emit(fileToUpload);
      }
    }

    event.target.value = '';
  }

  uploadFiles() {
    this.upload.emit();
  }

  clearFiles() {
    this.clear.emit();
  }

  getBase64(file: File) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }
}
