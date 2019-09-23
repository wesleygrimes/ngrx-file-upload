import { FileUploadStatus } from './file-upload-status';
export interface FileUploadModel {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  rawFile: File;
  progress: number;
  status: FileUploadStatus;
  error: string;
}
