import { Actions, ActionTypes } from './actions';
import { initialState, State } from './state';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.UPLOAD_REQUEST: {
      return {
        ...state,
        isLoading: true,
        completed: false,
        progress: null,
        error: null,
        cancel: false
      };
    }
    case ActionTypes.UPLOAD_RESET: {
      return {
        ...state,
        isLoading: false,
        completed: false,
        progress: null,
        error: null,
        cancel: false
      };
    }
    case ActionTypes.UPLOAD_CANCEL: {
      return {
        ...state,
        isLoading: false,
        completed: false,
        progress: null,
        error: null,
        cancel: true
      };
    }
    case ActionTypes.UPLOAD_FAILURE: {
      return {
        ...state,
        isLoading: false,
        completed: false,
        error: action.payload.error,
        progress: null,
        cancel: false
      };
    }
    case ActionTypes.UPLOAD_PROGRESS: {
      return {
        ...state,
        progress: action.payload.progress
      };
    }
    case ActionTypes.UPLOAD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        completed: true,
        progress: null,
        error: null,
        cancel: false
      };
    }
    default: {
      return state;
    }
  }
}
