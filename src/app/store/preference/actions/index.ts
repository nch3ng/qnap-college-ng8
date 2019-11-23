import { createAction, props } from '@ngrx/store';

export const loadCurrentDisplay = createAction(
  '[Main Page] load Current Display',
  props<{currentDisplay: string}>());

export const setCurrentDisplay = createAction(
  '[Main Page] Set Current Display',
  props<{currentDisplay: string}>());
