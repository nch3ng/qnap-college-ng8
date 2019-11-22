import { CourseDoc } from './../../_models/document';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { Observable, throwError, noop } from 'rxjs';
import { CourseService } from '../../_services/course.service';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { CoursesState } from 'src/app/store/courses/reducers';
import { loadAllCourses } from 'src/app/store/courses/actions';
import { PreferenceState } from 'src/app/store/preference/reducers';
import { setCurrentDisplay } from 'src/app/store/preference/actions';
import { AuthState } from 'src/app/auth/store/reducers';
import { isLoggedIn } from 'src/app/auth/store/selects';
import { getCurrentDisplay } from 'src/app/store/preference/selects';

@Injectable()
export class CoursesResolver implements Resolve<CourseDoc> {
  constructor(
    private courseService: CourseService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private cStore: Store<CoursesState>,
    private pStore: Store<PreferenceState>,
    private uStore: Store<AuthState>) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CourseDoc> | Promise<CourseDoc> | CourseDoc {

    let cs = 'Latest';
    // console.log('before');
    // const isLoggedIn$ = this.uStore.pipe(
    //   select(isLoggedIn)
    // );

    // isLoggedIn$.subscribe((loggedin) => {
    //   console.log('inside ' + loggedin);
    // });

    // const currentDisplay$ = this.pStore.pipe(
    //   select(getCurrentDisplay)
    // );

    // currentDisplay$.subscribe(currentDisplay => {
    //   !currentDisplay ? noop() : cs = currentDisplay;
    // });
    if (isPlatformBrowser(this.platformId)) {
      cs = localStorage.getItem('currentDisplay') || 'Latest';
    }

    // tslint:disable-next-line: variable-name
    let cs_value;
    let courses$: Observable<any>;
    for (const option of this.courseService.options) {
      // tslint:disable-next-line:no-string-literal
      if (option['name'] === cs) {
        // tslint:disable-next-line:no-string-literal
        cs_value = option['value'];
        break;
      }
    }
    let currentUser = null;
    if (isPlatformBrowser(this.platformId)) {
      currentUser = localStorage.getItem('currentUser');
    }

    if (currentUser !== null && typeof cs_value === 'undefined') {
      // console.log('favorite')
      courses$ = this.courseService.getFavoritedCourses(6);
    } else {
      // console.log('not favorite')
      if (typeof cs_value === 'undefined') {
        cs_value = 'publishedDate';
      }
      // console.log(cs_value);
      courses$ = this.courseService.all(6, cs_value) ;
    }
    this.pStore.dispatch(setCurrentDisplay({ currentDisplay: cs_value}));
    this.cStore.dispatch(loadAllCourses({count: 6, currentDisplay: cs_value}));
    return courses$.pipe(catchError(err => {
      this.router.navigate(['/maintenance']);
      return throwError(err);
    }));
  }
}
