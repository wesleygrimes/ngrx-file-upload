export interface Message {
  message: string;
}

export class UploadFileInputModel {
  constructor(
    public id: number,
    public fileName: string,
    public fileType: string,
    public fileSize: number,
    public fileContent: string,
    public progress: number,
    public status: UploadStatus,
    public error: string
  ) {}
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
