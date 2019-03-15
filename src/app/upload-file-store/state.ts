export enum UploadStatus {
  Ready = 'Ready',
  Requested = 'Requested',
  Started = 'Started',
  Failed = 'Failed',
  Completed = 'Completed'
}

export interface State {
  status: UploadStatus;
  error: string | null;
  progress: number;
}

export const initialState: State = {
  status: UploadStatus.Ready,
  error: null,
  progress: 0
};
