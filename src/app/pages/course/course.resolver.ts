import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';

@Injectable()
export class CourseResolver implements Resolve<Course | AppState> {
  constructor(private courseService: CourseService, private store: Store<AppState>) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Observable<Course> | Promise<Course> | Course {

    const type = route.params.id ? 'by_id' : 'by_slug';
    const param = route.params.id ? route.params.id : route.params.slug;
    // return this.store.pipe(
    //   tap(() => {
    //     this.store.dispatch(loadCourse({ qtype: type, qparam: param }));
    //   }),
    //   first()
    // );
    if (route.params.id) {
      return this.courseService.get(route.params.id);
    } else if (route.params.slug) {
      return this.courseService.get_by_slug(route.params.slug);
    }
  }
}
