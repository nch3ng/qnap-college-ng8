import { createAction, props } from '@ngrx/store';
import { User } from '../../_models/user.model';

export const loginSuccess = createAction(
      '[User Login] Login Success',
      props<{user: User, returnUrl?: string}>());

export const logout = createAction(
      '[User Logout] Logout',
      props<{ returnUrl?: string }>());
