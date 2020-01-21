import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { AuthActions } from '../actions/action-types';
import { tap } from 'rxjs/operators';
import { AuthService as SocialService } from 'angularx-social-login';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(action => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(action.user));
        }
        if (!!action.returnUrl) {
          this.router.navigateByUrl(action.returnUrl);
        }
      })
    ), { dispatch: false });

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(action => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentUser');
        }
        this.socialService.signOut();
        const returnUrl = action.returnUrl ? action.returnUrl : '/login';
        this.router.navigateByUrl(returnUrl);
      })
    ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private router: Router,
    private socialService: SocialService,
    @Inject(PLATFORM_ID) private platformId: object) {}
}
