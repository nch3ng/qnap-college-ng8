import { createReducer, on } from '@ngrx/store';
import { setCurrentDisplay } from '../actions';

export const preferenceFeatureKey = 'preference';

export interface PreferenceState {
  currentDisplay: string;
}

export const initialPreferenceState: PreferenceState = {
  currentDisplay: undefined
};

export const preferenceReducer = createReducer(
  initialPreferenceState,
  on(setCurrentDisplay, (state, action) => {
    return {
      currentDisplay: action.currentDisplay
    };
  })
);
