import { NgModule } from '@angular/core';
import { CourseComponent } from './course.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/_pipes/pipes.module';
import { SecurityModule } from 'src/app/admin/_directives/security.module';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'ngx-moment';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    PipesModule,
    NgPipesModule,
    SecurityModule,
    RouterModule,
  ],
  declarations: [
    CourseComponent
  ],
  exports: [
    CourseComponent
  ]
})

export class CourseModule {}
