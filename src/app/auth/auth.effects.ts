import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { AuthActions } from './action-types';
import { tap } from 'rxjs/operators';
import { AuthService as SocialService } from 'angularx-social-login';

@Injectable()
export class AuthEffects {

  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.login),
    tap(action => localStorage.setItem('currentUser', JSON.stringify(action.user)))
  ), { dispatch: false });

  logout$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logout),
    tap(action => this.signOut())
    ), { dispatch: false });
  adminLogout$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.adminLogout),
    tap(action => this.signOut())
    ), { dispatch: false });
  constructor(private actions$: Actions, private socialService: SocialService) {
  }

  signOut() {
    this.socialService.signOut();
    localStorage.removeItem('currentUser');
  }
}
