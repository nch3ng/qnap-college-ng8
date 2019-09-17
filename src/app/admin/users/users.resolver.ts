import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../auth/_models/user.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { UsersService } from '../../auth/_services/users.service';
import { environment } from '../../../environments/environment';
@Injectable()
export class UsersResolver implements Resolve<User []> {
  constructor(
    private _usersService: UsersService,
    private _toastr: ToastrService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User []> | Promise<User []>| User[] {
    let page = 1;
    if (route.params && route.params['page'])
      page = +route.params['page'];

    return this._usersService.all(page, environment.user_per_page).pipe(
      catchError((error) => {
        this._toastr.error('You are not authorized.');
        return throwError(error);
        // return Observable.of(null);
    }));
  }
}
