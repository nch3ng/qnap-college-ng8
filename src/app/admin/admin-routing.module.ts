import { CommentsResolver } from './comments/comments.resolver';
import { AuthGuard } from './../auth/_guards/auth.guard';
import { CourseNewComponent } from './courses/course-new/course-new.component';
import { CoursesComponent } from './courses/courses.component';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseResolver } from './courses/course.resolver';
import { CategoryResolver } from '../pages/index/category.resolver';
import { CourseEditComponent } from './courses/course-edit/course-edit.component';
import { SingleCourseResolver } from './courses/course-edit/single.course.resolver';
import { UsersComponent } from './users/users.component';
import { UserNewComponent } from './users/user-new/user-new.component';
import { UsersResolver } from './users/users.resolver';
import { ProfileComponent } from './profile/profile.component';
import { CommentsComponent } from './comments/comments.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['super admin', 'admin'] } 
      },
      {
        path: 'courses',
        component: CoursesComponent,
        resolve: { coursedoc: CourseResolver},
        canActivate: [AuthGuard],
        data: { roles: ['super admin', 'admin'] } 
      },
      {
        path: 'courses/:page',
        component: CoursesComponent,
        resolve: { coursedoc: CourseResolver},
        canActivate: [AuthGuard],
        data: { roles: ['super admin', 'admin'] } 
      },
      {
        path: 'course/new',
        component: CourseNewComponent,
        resolve: { categories: CategoryResolver},
        canActivate: [AuthGuard],
        data: { roles: ['super admin', 'admin'] } 
      },
      {
        path: 'course/:id/edit',
        component: CourseEditComponent,
        resolve: { categories: CategoryResolver, course: SingleCourseResolver},
        canActivate: [AuthGuard],
        data: { roles: ['super admin', 'admin'] } 
      },
      {
        path: 'users',
        component: UsersComponent,
        resolve: { doc: UsersResolver },
        canActivate: [AuthGuard],
        data: { roles: ['super admin', 'admin'] } 
      },
      {
        path: 'users/:page',
        component: UsersComponent,
        resolve: { doc: UsersResolver },
        canActivate: [AuthGuard],
        data: { roles: ['super admin', 'admin'] } 
      },
      {
        path: 'comments',
        component: CommentsComponent,
        resolve: { doc: CommentsResolver }
      },
      {
        path: 'comments/:page',
        component: CommentsComponent,
        resolve: { doc: CommentsResolver }
      },
      {
        path: 'user/new',
        component: UserNewComponent,
        canActivate: [AuthGuard],
        data: { roles: ['super admin'] } 
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
