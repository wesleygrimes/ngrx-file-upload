import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';
import { State } from './state';

const getError = (state: State): any => state.error;

const getIsLoading = (state: State): boolean => state.isLoading;

const getCompleted = (state: State): boolean => state.completed;

const getProgress = (state: State): number => state.progress;

const getCancelRequest = (state: State): boolean => state.cancel;

export const selectUploadFileFeatureState: MemoizedSelector<
  object,
  State
> = createFeatureSelector<State>('uploadFile');

export const selectUploadFileError: MemoizedSelector<
  object,
  any
> = createSelector(
  selectUploadFileFeatureState,
  getError
);

export const selectUploadFileIsLoading: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getIsLoading
);

export const selectUploadFileCompleted: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getCompleted
);

export const selectUploadFileProgress: MemoizedSelector<
  object,
  number
> = createSelector(
  selectUploadFileFeatureState,
  getProgress
);

export const selectUploadFileCancelRequest: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getCancelRequest
);
