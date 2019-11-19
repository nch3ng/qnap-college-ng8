import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { AuthActions } from './action-types';
import { tap } from 'rxjs/operators';
import { AuthService as SocialService } from 'angularx-social-login';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(action => {
        localStorage.setItem('currentUser', JSON.stringify(action.user));
      })
    ),
    { dispatch: false }
  );
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(action => {
        localStorage.removeItem('currentUser');
        this.socialService.signOut();
        const returnUrl = action.returnUrl ? action.returnUrl : '/';
        this.router.navigate(['/login'], { queryParams: { returnUrl }});
      })
    ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private socialService: SocialService,
    private router: Router) {
  }

  signOut() {
    this.socialService.signOut();
    localStorage.removeItem('currentUser');
  }
}
