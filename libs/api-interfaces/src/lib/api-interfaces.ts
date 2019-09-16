export interface Message {
  message: string;
}

export interface UploadFileInputModel {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileContent: string;
  progress: number;
  status: UploadStatus;
  error: string;
}

export interface UploadFileValidation {
  show: boolean;
  type: string;
  message: string;
}

export enum UploadStatus {
  Ready = 'Ready',
  Requested = 'Requested',
  Started = 'Started',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Failed = 'Failed'
}
