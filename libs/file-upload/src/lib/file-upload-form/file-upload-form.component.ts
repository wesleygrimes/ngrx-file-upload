import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'real-world-app-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.css']
})
export class FileUploadFormComponent {
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;

  @Output() fileAdded = new EventEmitter<File>();
  @Output() upload = new EventEmitter();
  @Output() clear = new EventEmitter();
  @Output() cancel = new EventEmitter();

  openFileDialog(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event) {
    if (event && event.target && event.target.files) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.fileAdded.emit(files[i]);
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

  cancelUpload() {
    this.cancel.emit();
  }
}
