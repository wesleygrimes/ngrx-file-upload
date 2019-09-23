import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import {
  FileUploadModel,
  FileUploadStatus
} from '@real-world-app/shared-models';
import * as FileUploadAPIActions from './file-upload-api.actions';
import * as FileUploadUIActions from './file-upload-ui.actions';

export interface FileUploadState extends EntityState<FileUploadModel> {
  loaded: boolean;
  error: string;
}

export const fileUploadFeatureKey = 'fileUpload';

export const featureAdapter = createEntityAdapter<FileUploadModel>({
  selectId: (model: FileUploadModel) => model.id
});

export const initialState: FileUploadState = featureAdapter.getInitialState({
  loaded: false,
  error: ''
});

const fileUploadReducer = createReducer(
  initialState,
  on(FileUploadUIActions.enqueueFile, (state, { fileToUpload }) => {
    return featureAdapter.addOne(fileToUpload, state);
  }),
  on(FileUploadUIActions.clearQueue, state => {
    return featureAdapter.removeAll({ ...state });
  }),
  on(FileUploadUIActions.removeFileFromQueue, (state, { id }) => {
    return featureAdapter.removeOne(id, state);
  }),
  on(FileUploadUIActions.uploadRequest, (state, { fileToUpload }) => {
    return featureAdapter.updateOne(
      { id: fileToUpload.id, changes: { status: FileUploadStatus.Requested } },
      state
    );
  }),
  on(FileUploadUIActions.retryUpload, (state, { id }) => {
    return featureAdapter.updateOne(
      {
        id,
        changes: {
          status: FileUploadStatus.Ready,
          progress: 0,
          error: null
        }
      },
      state
    );
  }),
  on(FileUploadAPIActions.uploadStarted, (state, { id }) => {
    return featureAdapter.updateOne(
      { id: id, changes: { status: FileUploadStatus.Started, progress: 0 } },
      state
    );
  }),
  on(FileUploadAPIActions.uploadProgress, (state, { id, progress }) => {
    return featureAdapter.updateOne(
      {
        id: id,
        changes: { status: FileUploadStatus.InProgress, progress: progress }
      },
      state
    );
  }),
  on(FileUploadAPIActions.uploadCompleted, (state, { id }) => {
    return featureAdapter.updateOne(
      {
        id: id,
        changes: { status: FileUploadStatus.Completed, progress: 100 }
      },
      state
    );
  }),
  on(FileUploadAPIActions.uploadFailure, (state, { id, error }) => {
    return featureAdapter.updateOne(
      {
        id: id,
        changes: {
          status: FileUploadStatus.Failed,
          progress: null,
          error: error
        }
      },
      state
    );
  }),
  on(FileUploadUIActions.cancelUpload, state => ({
    ...initialState
  }))
);

export function reducer(state: FileUploadState | undefined, action: Action) {
  return fileUploadReducer(state, action);
}
