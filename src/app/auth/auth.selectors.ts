import { authFeatureKey, AuthState } from './reducers/index';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

export const isLoggedIn = createSelector(
  selectAuthState,
  auth => !!auth.user
);

export const isLoggedOut = createSelector(
  isLoggedIn,
  LoggedIn => !LoggedIn
);

export const getUser = createSelector(
  selectAuthState,
  auth => auth.user
);
