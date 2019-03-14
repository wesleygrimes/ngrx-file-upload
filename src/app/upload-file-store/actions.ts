import { Action } from '@ngrx/store';

export enum ActionTypes {
  UPLOAD_REQUEST = '[File Upload Form] Request',
  UPLOAD_RESET = '[File Upload Form] Reset',
  UPLOAD_CANCEL = '[File Upload Form] Cancel',
  UPLOAD_FAILURE = '[File Upload API] Failure',
  UPLOAD_SUCCESS = '[File Upload API] Success',
  UPLOAD_PROGRESS = '[File Upload API] Progress'
}

export class UploadRequestAction implements Action {
  readonly type = ActionTypes.UPLOAD_REQUEST;
  constructor(public payload: { file: File }) {}
}

export class UploadFailureAction implements Action {
  readonly type = ActionTypes.UPLOAD_FAILURE;
  constructor(public payload: { error: string }) {}
}

export class UploadSuccessAction implements Action {
  readonly type = ActionTypes.UPLOAD_SUCCESS;
}

export class UploadProgressAction implements Action {
  readonly type = ActionTypes.UPLOAD_PROGRESS;
  constructor(public payload: { progress: number }) {}
}

export class UploadResetAction implements Action {
  readonly type = ActionTypes.UPLOAD_RESET;
}

export class UploadCancelAction implements Action {
  readonly type = ActionTypes.UPLOAD_CANCEL;
}

export type Actions =
  | UploadRequestAction
  | UploadFailureAction
  | UploadSuccessAction
  | UploadProgressAction
  | UploadResetAction
  | UploadCancelAction;
