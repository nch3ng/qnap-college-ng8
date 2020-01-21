import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { setCurrentDisplay } from '../actions';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class PreferenceEffect {
  setCurrentDisplay$ =
    createEffect(() => this.actions$
      .pipe(
        ofType(setCurrentDisplay),
        tap((action) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentDisplay', action.currentDisplay);
          }
        })
      ), { dispatch: false }
  );
  constructor(
    private actions$: Actions,
    @Inject(PLATFORM_ID) private platformId: object) {}
}
