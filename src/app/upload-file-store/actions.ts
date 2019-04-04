import { createAction, props } from '@ngrx/store';

export const uploadRequest = createAction(
  '[File Upload Form] Request',
  props<{ file: File }>()
);

export const uploadCancel = createAction('[File Upload Form] Cancel');

export const uploadReset = createAction('[File Upload Form] Reset');

export const uploadStarted = createAction('[File Upload Form] Started');

export const uploadProgress = createAction(
  '[File Upload Form] Progress',
  props<{ progress: number }>()
);

export const uploadFailure = createAction(
  '[File Upload Form] Failure',
  props<{ error: string }>()
);

export const uploadCompleted = createAction('[File Upload Form] Completed');

export type UploadFileStoreActionsUnion =
  | ReturnType<typeof uploadRequest>
  | ReturnType<typeof uploadCancel>
  | ReturnType<typeof uploadReset>
  | ReturnType<typeof uploadStarted>
  | ReturnType<typeof uploadProgress>
  | ReturnType<typeof uploadFailure>
  | ReturnType<typeof uploadCompleted>;
