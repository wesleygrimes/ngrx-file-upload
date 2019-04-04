import {
  uploadCancel,
  uploadCompleted,
  uploadFailure,
  UploadFileStoreActionsUnion,
  uploadProgress,
  uploadRequest,
  uploadReset,
  uploadStarted
} from './actions';
import { initialState, State, UploadStatus } from './state';

export function featureReducer(
  state = initialState,
  action: UploadFileStoreActionsUnion
): State {
  switch (action.type) {
    case uploadRequest.type: {
      return {
        ...state,
        status: UploadStatus.Requested,
        progress: null,
        error: null
      };
    }
    case uploadCancel.type: {
      return {
        ...state,
        status: UploadStatus.Ready,
        progress: null,
        error: null
      };
    }
    case uploadReset.type: {
      return {
        ...state,
        status: UploadStatus.Ready,
        progress: null,
        error: null
      };
    }
    case uploadFailure.type: {
      return {
        ...state,
        status: UploadStatus.Failed,
        error: action.error,
        progress: null
      };
    }
    case uploadStarted.type: {
      return {
        ...state,
        status: UploadStatus.Started,
        progress: 0
      };
    }
    case uploadProgress.type: {
      return {
        ...state,
        progress: action.progress
      };
    }
    case uploadCompleted.type: {
      return {
        ...state,
        status: UploadStatus.Completed,
        progress: 100,
        error: null
      };
    }
    default: {
      return state;
    }
  }
}
