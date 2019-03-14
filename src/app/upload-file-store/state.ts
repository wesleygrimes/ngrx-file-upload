export interface State {
  completed: boolean;
  isLoading: boolean;
  error: any | null;
  progress: number | null;
  cancel: boolean;
}

export const initialState: State = {
  completed: false,
  isLoading: false,
  error: null,
  progress: null,
  cancel: false
};
