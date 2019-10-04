import { createAction, props } from '@ngrx/store';
import { User } from './_models/user.model';

export const login = createAction(
      '[User Login] Login',
      props<{user: User, returnUrl?: string}>());

export const logout = createAction(
      '[User Logout] Logout',
      props<{ returnUrl?: string }>());
