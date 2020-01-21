import { createReducer, on } from '@ngrx/store';
import { setCurrentDisplay, loadCurrentDisplay } from '../actions';

export const preferenceFeatureKey = 'preference';

export interface PreferenceState {
  currentDisplay: string;
}

export const initialPreferenceState: PreferenceState = {
  currentDisplay: undefined
};

// tslint:disable-next-line:variable-name
const _preferenceReducer = createReducer(
  initialPreferenceState,
  on(loadCurrentDisplay, (state, action) => {
    return {
      currentDisplay: action.currentDisplay
    };
  }),
  on(setCurrentDisplay, (state, action) => {
    return {
      currentDisplay: action.currentDisplay
    };
  })
);

export function preferenceReducer(state, action) {
  return _preferenceReducer(state, action);
}

