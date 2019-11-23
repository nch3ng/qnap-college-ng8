import { createSelector, createFeatureSelector, Store, select } from '@ngrx/store';
import { PreferenceState, preferenceFeatureKey } from '../reducers';
import { isLoggedIn, selectAuthState } from '../../../auth/store/selects';
import { AppState } from 'src/app/reducers';
import { authFeatureKey } from 'src/app/auth/store/reducers';

export const selectPreferenceState = createFeatureSelector<PreferenceState>(preferenceFeatureKey);

export const getCurrentDisplay = createSelector(
  state => {
    return {
      loggedIn: !!state[authFeatureKey].user,
      preference: state[preferenceFeatureKey]
     };
  },
  state => {
    // console.log(state);
    if (state.loggedIn) {
      return state.preference['currentDisplay'];
    } else {
      if (state.preference === 'My Favorite') {
        return 'Latest';
      } else {
        return state.preference['currentDisplay'];
      }
    }
  }
);

