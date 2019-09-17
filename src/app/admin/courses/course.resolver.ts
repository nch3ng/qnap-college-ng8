import { CourseDoc } from './../../_models/document';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CourseResolver implements Resolve<CourseDoc> {
  constructor(private _courseService: CourseService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CourseDoc> | Promise<CourseDoc> | CourseDoc {
    
    let page = 1;
    if (route.params && route.params['page'])
      page = +route.params['page'];
    return this._courseService.all(10, null, page);
  }
}
