import { isLoggedIn } from './../auth.selectors';

import { tap } from 'rxjs/operators';
import { AuthService } from './../_services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError, noop } from 'rxjs';


import { ToastrService } from 'ngx-toastr';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { getAuthUser } from '../auth.select';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private store: Store<AppState>) {
  }

  private getUrlParameter(url, name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('canActivate');
    return this.store.pipe(
      select(isLoggedIn),
      tap(loggedIn => {
        // console.log(loggedIn);
        if (!loggedIn) {
          this.router.navigateByUrl('/login');
        } else {
          this.store.pipe(
            select(getAuthUser),
            tap(user => {
              // tslint:disable-next-line:no-string-literal
              const roles = route.data['roles'] as Array<string>;
              if (roles) {
                if (!user || !roles.includes(user.role.name)) {
                  this.toastr.error('You are not authorized. Redirected to Profile');
                  this.router.navigate(['/admin/profile']);
                  return false;
                }
              }
            })
          ).subscribe(noop, err => console.error(err));
        }
      })
    );
    // return this.authService.verify().pipe(map(
    //   (data) => {
    //     // console.log('[AuthGuard] data: ', data);
    //     if (data !== null && data.success) {
    //       // logged in so return true
    //       return true;
    //     } else {
    //       // error when verify so redirect to login page with the return url
    //       this.store.dispatch(AuthActions.logout());
    //       return false;
    //     }
    //   },
    //   (error) => {
    //     // console.log(error);
    //     // error when verify so redirect to login page with the return url
    //     localStorage.removeItem('currentUser');
    //     this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    //     return false;
    //   })).pipe(catchError((err) => {
    //     return throwError(err);
    //   }));
  }
}
