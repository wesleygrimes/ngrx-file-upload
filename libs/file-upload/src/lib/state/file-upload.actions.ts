import { createAction, props } from '@ngrx/store';
import { UploadFileInputModel } from '@real-world-app/api-interfaces';

export const enqueueFile = createAction(
  '[File Upload Form] Enqueue File',
  props<{ fileToUpload: UploadFileInputModel }>()
);
export const processQueue = createAction('[File Upload Form] Process Queue');
export const clearQueue = createAction('[File Upload Form] Clear Queue');
export const removeFileFromQueue = createAction(
  '[File Upload Form] Remove File From Queue',
  props<{ id: number }>()
);
export const uploadRequest = createAction(
  '[File Upload Form] Upload Request',
  props<{ fileToUpload: UploadFileInputModel }>()
);
export const uploadStarted = createAction(
  '[File Upload Api] Upload Started',
  props<{ id: number }>()
);
export const uploadProgress = createAction(
  '[File Upload Api] Upload Progress',
  props<{ id: number; progress: number }>()
);
export const uploadCompleted = createAction(
  '[File Upload Api] Upload Complete',
  props<{ id: number }>()
);
export const uploadFailure = createAction(
  '[File Upload Api] Upload Failure',
  props<{ id: number; error: string }>()
);
export const retryUpload = createAction(
  '[File Upload Form] Retry File Upload',
  props<{ id: number }>()
);
export const downloadFile = createAction(
  '[File Upload Form] Download File',
  props<{ id: number }>()
);
