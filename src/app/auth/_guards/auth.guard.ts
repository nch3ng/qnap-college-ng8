
import { map, catchError, tap } from 'rxjs/operators';
import { AuthService } from './../_services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';


import { ToastrService } from 'ngx-toastr';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { isLoggedIn, getAuthUser } from '../auth.select';
import { User } from '../_models/user.model';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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

    return this.store.pipe(
      select(isLoggedIn),
      tap(loggedIn => {
        if (loggedIn) {
          this.store.pipe(
            select(getAuthUser),
            tap((authUser: User) => {
              // tslint:disable-next-line:no-string-literal
              const roles = route.data['roles'] as Array<string>;
              if (roles) {
                if (!authUser || !roles.includes(authUser.role.name)) {
                  this.toastr.error('You are not authorized. Redirected to Profile');
                  this.router.navigate(['/profile']);
                }
              }
            })
          );
        } else {
          this.router.navigateByUrl('/login');
        }
      })
    );
    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // tslint:disable-next-line:no-string-literal
    // const roles = route.data['roles'] as Array<string>;
    // console.log('[canActivate]: roles: ' + roles);
    // console.log('[canActivate]: user: ', currentUser);
    // if (roles) {
    //   // console.log('into roles')
    //   if (!currentUser || !roles.includes(currentUser.role.name)) {
    //     this.toastr.error('You are not authorized. Redirected to Profile');
    //     this.router.navigate(['/profile']);
    //     return false;
    //   }
    // }


  //   return this.authService.verify().pipe(map(
  //     (data) => {
  //       // console.log('[AuthGuard] data: ', data);
  //       if (data !== null && data.success) {
  //         // logged in so return true
  //         // this.authService.loggedIn() = true;
  //         return true;
  //       } else {
  //         // error when verify so redirect to login page with the return url
  //         localStorage.removeItem('currentUser');
  //         this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  //         return false;
  //       }
  //     },
  //     (error) => {
  //       // console.log(error);
  //       // error when verify so redirect to login page with the return url
  //       localStorage.removeItem('currentUser');
  //       this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
  //       return false;
  //     })).pipe(catchError((err) => {
  //       return throwError(err);
  //     }));
  // }
  }
}
