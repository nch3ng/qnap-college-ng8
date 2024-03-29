import { createAction, props } from '@ngrx/store';
import { Course } from 'src/app/_models/course';

export const loadAllCourses = createAction(
  '[Courses Resolver] Load All Courses',
  props<{ count?: number, currentDisplay: string, page?: number}>()
);

export const allCoursesLoaded = createAction(
  '[Load Courses Effect] All Courses Loaded',
  props<{courses: Course [], page: number, pages: number, total: number}>()
);

export const loadExtraCourses = createAction(
  '[Index Page] Load Extra Courses'
);
