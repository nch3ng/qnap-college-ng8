import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PreferenceState, preferenceFeatureKey } from '../reducers';

export const selectPreferenceState = createFeatureSelector<PreferenceState>(preferenceFeatureKey);
export const getCurrentDisplay = createSelector(
  selectPreferenceState,
  cs => cs.currentDisplay
);

