import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { setCurrentDisplay } from '../actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class PreferenceEffect {
  setCurrentDisplay$ =
    createEffect(() => this.actions$
      .pipe(
        ofType(setCurrentDisplay),
        tap((action) => {
          localStorage.setItem('currentDisplay', action.currentDisplay);
        })
      ), { dispatch: false }
  );
  constructor(
    private actions$: Actions) {}
}
