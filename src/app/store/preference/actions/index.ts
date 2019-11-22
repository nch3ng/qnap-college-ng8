import { createAction, props } from '@ngrx/store';

export const setCurrentDisplay = createAction(
  '[Home Page] Set Current Display',
  props<{currentDisplay: string}>());
