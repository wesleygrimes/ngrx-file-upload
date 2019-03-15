import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';
import { State, UploadStatus } from './state';

const getError = (state: State): string => state.error;

const getStarted = (state: State): boolean =>
  state.status === UploadStatus.Started;

const getRequested = (state: State): boolean =>
  state.status === UploadStatus.Requested;

const getReady = (state: State): boolean => state.status === UploadStatus.Ready;

const getProgress = (state: State): number => state.progress;

const getInProgress = (state: State): boolean =>
  state.status === UploadStatus.Started && state.progress >= 0;

const getFailed = (state: State): boolean =>
  state.status === UploadStatus.Failed;

const getCompleted = (state: State): boolean =>
  state.status === UploadStatus.Completed;

export const selectUploadFileFeatureState: MemoizedSelector<
  object,
  State
> = createFeatureSelector<State>('uploadFile');

export const selectUploadFileError: MemoizedSelector<
  object,
  string
> = createSelector(
  selectUploadFileFeatureState,
  getError
);

export const selectUploadFileReady: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getReady
);

export const selectUploadFileRequested: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getRequested
);

export const selectUploadFileStarted: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getStarted
);

export const selectUploadFileProgress: MemoizedSelector<
  object,
  number
> = createSelector(
  selectUploadFileFeatureState,
  getProgress
);

export const selectUploadFileInProgress: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getInProgress
);

export const selectUploadFileFailed: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getFailed
);

export const selectUploadFileCompleted: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getCompleted
);
