import { CommentsService } from './../../_services/comment.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CourseService } from '../../_services/course.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CommentsResolver implements Resolve<any> {
  constructor(private _commentsService: CommentsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const cUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(cUser);
    let page = 1;
    if (route.params && route.params['page'])
      page = +route.params['page'];

    return this._commentsService.getCommentsByUserId(cUser._id, 5, page);
  }
}