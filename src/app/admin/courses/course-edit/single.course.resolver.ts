import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Course } from '../../../_models/course';
import { CourseService } from '../../../_services/course.service';

@Injectable()
export class SingleCourseResolver implements Resolve<Course> {
  constructor(private _courseService: CourseService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Course> | Promise<Course> | Course {
    console.log(route.params.id);
    return this._courseService.get(route.params.id);
  }
}
