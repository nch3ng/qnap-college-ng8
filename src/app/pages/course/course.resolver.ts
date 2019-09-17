import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CourseResolver implements Resolve<Course> {
  constructor(private courseService: CourseService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Course> | Promise<Course> | Course {
    if (route.params.id) {
      return this.courseService.get(route.params.id);
    } else if (route.params.slug) {
      return this.courseService.get_by_slug(route.params.slug);
    }
  }
}
