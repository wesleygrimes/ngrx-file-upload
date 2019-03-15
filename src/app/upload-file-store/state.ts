export enum UploadStatus {
  Ready = 'Ready',
  Requested = 'Requested',
  Started = 'Started',
  InProgress = 'InProgress',
  Failed = 'Failed',
  Completed = 'Completed'
}

export interface State {
  status: UploadStatus;
  error: string | null;
  progress: number | null;
}

export const initialState: State = {
  status: UploadStatus.Ready,
  error: null,
  progress: null
};
