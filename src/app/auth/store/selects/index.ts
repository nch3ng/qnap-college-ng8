import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState, authReducer, authFeatureKey } from '../reducers';

export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);
export const isLoggedIn = createSelector(
  selectAuthState,
  auth => !!auth.user
);

export const isLoggedOut = createSelector(
  isLoggedIn,
  loggedIn => !loggedIn
);

export const getAuthUser = createSelector(
  selectAuthState,
  auth => auth.user
);

