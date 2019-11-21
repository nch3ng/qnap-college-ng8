import { User } from '../../_models/user.model';
import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Login Page] User Login',
  props<{user: User}>()
);

export const logout = createAction(
  '[Front Page] User Logout',
  props<{returnUrl: string}>()
);

export const adminLogout = createAction(
  '[Admin Page] User Logout'
);

