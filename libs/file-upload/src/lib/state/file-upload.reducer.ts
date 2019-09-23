import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import {
  FileUploadModel,
  FileUploadStatus
} from '@real-world-app/shared-models';
import * as FileUploadActions from './file-upload.actions';

export interface FileUploadState extends EntityState<FileUploadModel> {
  selectedId: string | null;
  loaded: boolean;
  error: string | null;
}

export const fileUploadFeatureKey = 'fileUpload';

export const featureAdapter = createEntityAdapter<FileUploadModel>({
  selectId: (model: FileUploadModel) => model.id
});

export const initialState: FileUploadState = featureAdapter.getInitialState({
  selectedId: null,
  loaded: false,
  error: null
});

const fileUploadReducer = createReducer(
  initialState,
  on(FileUploadActions.enqueueFile, (state, { fileToUpload }) => {
    return featureAdapter.addOne(fileToUpload, state);
  }),
  on(FileUploadActions.clearQueue, state => {
    return featureAdapter.removeAll({ ...state });
  }),
  on(FileUploadActions.removeFileFromQueue, (state, { id }) => {
    return featureAdapter.removeOne(id, state);
  }),
  on(FileUploadActions.uploadRequest, (state, { fileToUpload }) => {
    return featureAdapter.updateOne(
      { id: fileToUpload.id, changes: { status: FileUploadStatus.Requested } },
      state
    );
  }),
  on(FileUploadActions.retryUpload, (state, { id }) => {
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
  on(FileUploadActions.uploadStarted, (state, { id }) => {
    return featureAdapter.updateOne(
      { id: id, changes: { status: FileUploadStatus.Started, progress: 0 } },
      state
    );
  }),
  on(FileUploadActions.uploadProgress, (state, { id, progress }) => {
    return featureAdapter.updateOne(
      {
        id: id,
        changes: { status: FileUploadStatus.InProgress, progress: progress }
      },
      state
    );
  }),
  on(FileUploadActions.uploadCompleted, (state, { id }) => {
    return featureAdapter.updateOne(
      {
        id: id,
        changes: { status: FileUploadStatus.Completed, progress: 100 }
      },
      state
    );
  }),
  on(FileUploadActions.uploadFailure, (state, { id, error }) => {
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
  })
);

export function reducer(state: FileUploadState | undefined, action: Action) {
  return fileUploadReducer(state, action);
}
