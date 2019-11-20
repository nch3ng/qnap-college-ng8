import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadAllCourses, allCoursesLoaded } from '../actions';
import { tap, concatMap, map } from 'rxjs/operators';
import { CourseService } from 'src/app/_services/course.service';
import { CourseDoc } from 'src/app/_models/document';

@Injectable()
export class CoursesEffect {
  loadCourses$ =
    createEffect(() => this.actions$
      .pipe(
        ofType(loadAllCourses),
        concatMap((action) => this.coursesService.all(6, action.group_type)),
        // tslint:disable-next-line:max-line-length
        map((coursesDoc: CourseDoc) => allCoursesLoaded({courses: coursesDoc.docs, page: coursesDoc.page, pages: coursesDoc.pages, total: coursesDoc.total}))
      )
    );

  constructor(private actions$: Actions, private coursesService: CourseService) {}
}
