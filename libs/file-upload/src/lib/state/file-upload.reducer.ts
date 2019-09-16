import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import {
  UploadFileInputModel,
  UploadStatus
} from '@real-world-app/api-interfaces';
import * as fileUploadActions from './file-upload.actions';

export interface FileUploadState extends EntityState<UploadFileInputModel> {
  selectedId: string | null;
  loaded: boolean;
  error: string | null;
}

export const fileUploadFeatureKey = 'fileUpload';

export const featureAdapter = createEntityAdapter<UploadFileInputModel>({
  selectId: (model: UploadFileInputModel) => model.id
});

export const initialState: FileUploadState = featureAdapter.getInitialState({
  selectedId: null,
  loaded: false,
  error: null
});

const fileUploadReducer = createReducer(
  initialState,
  on(fileUploadActions.enqueueFile, (state, { fileToUpload }) => {
    return featureAdapter.addOne(fileToUpload, state);
  }),
  on(fileUploadActions.clearQueue, state => {
    return featureAdapter.removeAll({ ...state });
  }),
  on(fileUploadActions.removeFileFromQueue, (state, { id }) => {
    return featureAdapter.removeOne(id, state);
  }),
  on(fileUploadActions.uploadRequest, (state, { fileToUpload }) => {
    return featureAdapter.updateOne(
      { id: fileToUpload.id, changes: { status: UploadStatus.Requested } },
      state
    );
  }),
  on(fileUploadActions.retryUpload, (state, { id }) => {
    return featureAdapter.updateOne(
      {
        id,
        changes: {
          status: UploadStatus.Ready,
          progress: 0,
          error: null
        }
      },
      state
    );
  }),
  on(fileUploadActions.uploadStarted, (state, { id }) => {
    return featureAdapter.updateOne(
      { id: id, changes: { status: UploadStatus.Started, progress: 0 } },
      state
    );
  }),
  on(fileUploadActions.uploadProgress, (state, { id, progress }) => {
    return featureAdapter.updateOne(
      {
        id: id,
        changes: { status: UploadStatus.InProgress, progress: progress }
      },
      state
    );
  }),
  on(fileUploadActions.uploadCompleted, (state, { id }) => {
    return featureAdapter.updateOne(
      {
        id: id,
        changes: { status: UploadStatus.Completed, progress: 100 }
      },
      state
    );
  }),
  on(fileUploadActions.uploadFailure, (state, { id, error }) => {
    return featureAdapter.updateOne(
      {
        id: id,
        changes: { status: UploadStatus.Failed, progress: null, error: error }
      },
      state
    );
  })
);

export function reducer(state: FileUploadState | undefined, action: Action) {
  return fileUploadReducer(state, action);
}
