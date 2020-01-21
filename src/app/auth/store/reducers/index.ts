import {
  createReducer,
  on
} from '@ngrx/store';
import { AuthActions } from '../actions/action-types';
import { User } from '../../_models/user.model';

export const authFeatureKey = 'auth';
// tslint:disable-next-line:no-empty-interface
export interface AuthState {
  user: User;
}

export const initialAuthState: AuthState = {
  user: undefined
};

// tslint:disable-next-line:variable-name
const _authReducer = createReducer(
  initialAuthState,
  on(AuthActions.loginSuccess, (state, action) => {
    return {
      user: action.user
    };
  }),
  on(AuthActions.logout, (state, action) => {
    return {
      user: undefined
    };
  })
);

export function authReducer(state, action) {
  return _authReducer(state, action);
}
