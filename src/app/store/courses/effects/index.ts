import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadAllCourses, allCoursesLoaded } from '../actions';
import { concatMap, map } from 'rxjs/operators';
import { CourseService } from 'src/app/_services/course.service';
import { CourseDoc } from 'src/app/_models/document';
import { Store, select } from '@ngrx/store';
import { AuthState } from 'src/app/auth/store/reducers';
import { isLoggedIn } from 'src/app/auth/store/selects';
import { AppState } from 'src/app/reducers';

@Injectable()
export class CoursesEffect {
  loadCourses$ =
    createEffect(() => this.actions$
      .pipe(
        ofType(loadAllCourses),
        concatMap((action) => {
          let loggedIn = false;
          this.store.pipe(
            select(isLoggedIn)
          ).subscribe(logIn => {
            loggedIn = logIn;
          });


          return  this.coursesService.all(action.count, action.currentDisplay, action.page || 1);
        }),
        // tslint:disable-next-line:max-line-length
        map((coursesDoc: CourseDoc) =>  {
          // console.log(coursesDoc);
          return allCoursesLoaded({courses: coursesDoc.docs, page: coursesDoc.page, pages: coursesDoc.pages, total: coursesDoc.total});
        })
      ), {dispatch: true}
    );

  constructor(
    private actions$: Actions,
    private coursesService: CourseService,
    private store: Store<AppState>) {}
}
