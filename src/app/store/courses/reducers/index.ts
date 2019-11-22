import { Course } from 'src/app/_models/course';
import { createReducer, on } from '@ngrx/store';
import { allCoursesLoaded } from '../actions';

export const coursesFeatureKey = 'courses';

export interface CoursesState {
  page: number;
  courses: Course [];
  pages: number;
  total: number;
}

export const initialCoursesState: CoursesState = {
  page: 1,
  courses: [],
  pages: 1,
  total: 0,
};

export const coursesReducer = createReducer(
  initialCoursesState,
  on(allCoursesLoaded, (state, action) => {
    return {
      courses: action.courses,
      page: action.page,
      pages: action.pages,
      total: action.total
    };
  })
);
