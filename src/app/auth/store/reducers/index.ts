import { User } from '../../_models/user.model';
import {
  createReducer,
  on
} from '@ngrx/store';
import { AuthActions } from '../actions';

export const authFeatureKey = 'auth';

export const initialAuthState: AuthState = {
  user: undefined
};
export interface AuthState {
  user: User;
}

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state, action) => {
    return {
      user: action.user
    };
  }),
  on(AuthActions.logout, (state, action) => {
    return {
      user: undefined
    };
  }),
  on(AuthActions.adminLogout, (state, action) => {
    return {
      user: undefined
    };
  })
);
