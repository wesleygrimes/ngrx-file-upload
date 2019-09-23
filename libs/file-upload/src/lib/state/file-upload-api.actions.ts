import { createAction, props } from '@ngrx/store';

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
