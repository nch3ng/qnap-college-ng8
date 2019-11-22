import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadAllCourses, allCoursesLoaded } from '../actions';
import { concatMap, map } from 'rxjs/operators';
import { CourseService } from 'src/app/_services/course.service';
import { CourseDoc } from 'src/app/_models/document';
import { Store, select } from '@ngrx/store';
import { AuthState } from 'src/app/auth/store/reducers';

@Injectable()
export class CoursesEffect {
  loadCourses$ =
    createEffect(() => this.actions$
      .pipe(
        ofType(loadAllCourses),
        concatMap((action) => {
          return  this.coursesService.all(action.count, action.currentDisplay);
        }),
        // tslint:disable-next-line:max-line-length
        map((coursesDoc: CourseDoc) =>  {
          console.log(coursesDoc);
          return allCoursesLoaded({courses: coursesDoc.docs, page: coursesDoc.page, pages: coursesDoc.pages, total: coursesDoc.total});
        })
      ), {dispatch: true}
    );

  constructor(
    private actions$: Actions,
    private coursesService: CourseService,
    private store: Store<AuthState>) {}
}
