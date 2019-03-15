import { Actions, ActionTypes } from './actions';
import { initialState, State, UploadStatus } from './state';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.UPLOAD_REQUEST: {
      return {
        ...state,
        status: UploadStatus.Requested,
        progress: null,
        error: null
      };
    }
    case ActionTypes.UPLOAD_CANCEL: {
      return {
        ...state,
        status: UploadStatus.Ready,
        progress: null,
        error: null
      };
    }
    case ActionTypes.UPLOAD_RESET: {
      return {
        ...state,
        status: UploadStatus.Ready,
        progress: null,
        error: null
      };
    }
    case ActionTypes.UPLOAD_FAILURE: {
      return {
        ...state,
        status: UploadStatus.Failed,
        error: action.payload.error,
        progress: null
      };
    }
    case ActionTypes.UPLOAD_STARTED: {
      return {
        ...state,
        status: UploadStatus.Started,
        progress: 0
      };
    }
    case ActionTypes.UPLOAD_PROGRESS: {
      return {
        ...state,
        progress: action.payload.progress
      };
    }
    case ActionTypes.UPLOAD_COMPLETED: {
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
