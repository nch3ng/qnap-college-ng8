import { CommentsService } from './../../_services/comment.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, noop } from 'rxjs';
import { CourseService } from '../../_services/course.service';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AuthState } from 'src/app/auth/store/reducers';
import { getAuthUser } from 'src/app/auth/store/selects';
import { tap } from 'rxjs/operators';

@Injectable()
export class CommentsResolver implements Resolve<any> {
  // tslint:disable-next-line:variable-name
  constructor(private _commentsService: CommentsService, private store: Store<AuthState>) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {

    let cUser;
    const user$ = this.store.pipe(
      select(getAuthUser),
      tap((user => {
        cUser = user;
      }))
    ).subscribe(noop);
    // console.log(cUser)
    // const cUser = JSON.parse(localStorage.getItem('currentUser'));
    let page = 1;
    // tslint:disable-next-line:no-string-literal
    if (route.params && route.params['page']) {
      // tslint:disable-next-line:no-string-literal
      page = +route.params['page'];
    }

    return this._commentsService.getCommentsByUserId(cUser._id, 5, page);
  }
}
