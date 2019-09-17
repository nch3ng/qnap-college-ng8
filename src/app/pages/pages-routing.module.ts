import { TermsOfUseComponent } from './termsofuse/termsofuse.component';
import { CourseResolver } from './course/course.resolver';
import { CourseComponent } from './course/course.component';
import { CategoryComponent } from './category/category.component';
import { CatCourseResolver } from './category/cat.course.resolver';
import { CategoryResolver } from './index/category.resolver';
import { CoursesResolver } from './index/courses.resolver';
import { IndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { SearchResolver } from './search/search.resolver';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '', component: IndexComponent,
        resolve: { coursedoc: CoursesResolver, categories: CategoryResolver}
      },
      {
        path: 'category/:name', component: CategoryComponent,
        resolve: { courses: CatCourseResolver },
        data: {
          meta: {
            title: 'Category',
            description: 'Different level of courses.'
          }
        }
      },
      {
        path: 'search/:keywords', component: SearchComponent,
        resolve: { courses: SearchResolver }
      },
      {
        path: 'tag/:tag_name', component: CategoryComponent,
        resolve: { courses: CatCourseResolver }
      },
      {
        path: 'course/:id', component: CourseComponent,
        resolve: { course: CourseResolver },
        data: {
          meta: {
            title: 'Course',
            description: 'Description',
            overrider: true
          }
        }
      },
      {
        path: 'course/s/:slug', component: CourseComponent,
        resolve: { course: CourseResolver },
        data: {
          meta: {
            title: 'Course',
            description: 'Course',
            overrider: true
          }
        }
      },
      {
        path: 'termsofuse', component: TermsOfUseComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
