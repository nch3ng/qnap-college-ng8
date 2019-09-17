import { CommentsComponent } from './comments/comments.component';
import { NgxDaterangepickerModule } from '@qqnc/ngx-daterangepicker';
import { KeywordService } from './../_services/keyword.services';
import { MomentModule } from 'ngx-moment';
import { NgSelectModule } from '@ng-select/ng-select';

import { CourseResolver } from './courses/course.resolver';

import { NgPipesModule, UcFirstPipe, SlugifyPipe } from 'ngx-pipes';
import { CoursesComponent } from './courses/courses.component';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseNewComponent } from './courses/course-new/course-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmService } from '../_services/confirm.service';
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { CourseEditComponent } from './courses/course-edit/course-edit.component';
import { SingleCourseResolver } from './courses/course-edit/single.course.resolver';
import { ToastrService } from 'ngx-toastr';
import { UsersComponent } from './users/users.component';
import { UserNewComponent } from './users/user-new/user-new.component';
import { UsersResolver } from './users/users.resolver';
import { UsersService } from '../auth/_services/users.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileComponent } from './profile/profile.component';
import { SecurityModule } from './_directives/security.module';
import { RoleService } from '../_services/role.service';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgPipesModule,
    MomentModule,
    FormsModule,
    TagInputModule,
    ReactiveFormsModule,
    NgSelectModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    FontAwesomeModule,
    NgxDaterangepickerModule,
    NgbModule,
    SecurityModule
  ],
  declarations: [
    DashboardComponent,
    AdminComponent,
    CoursesComponent,
    CourseNewComponent,
    CourseEditComponent,
    UsersComponent,
    UserNewComponent,
    ProfileComponent,
    CommentsComponent
  ],
  providers: [
    CourseResolver,
    UcFirstPipe,
    ConfirmService,
    SingleCourseResolver,
    ToastrService,
    SlugifyPipe,
    UsersResolver,
    UsersService,
    KeywordService,
    RoleService
  ]
})
export class AdminModule { }
