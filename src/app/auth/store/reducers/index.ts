import {
  createReducer,
  on
} from '@ngrx/store';
import { AuthActions } from '../actions/action-types';
import { User } from '../../_models/user.model';
import { isNullOrUndefined } from 'util';

// tslint:disable-next-line:no-empty-interface
export interface AuthState {
  user: User;
}

export const initialAuthState: AuthState = {
  user: undefined
};

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
  })
);
