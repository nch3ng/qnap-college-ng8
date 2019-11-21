import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/_pipes/pipes.module';
import { SecurityModule } from 'src/app/admin/_directives/security.module';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'ngx-moment';
import { NgPipesModule } from 'ngx-pipes';
import { IndexComponent } from './index.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { StoreModule } from '@ngrx/store';
import * as fromCourses from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { CoursesEffect } from './store/effects';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    PipesModule,
    NgPipesModule,
    SecurityModule,
    RouterModule,
    InfiniteScrollModule,
    StoreModule.forFeature(fromCourses.coursesFeatureKey, fromCourses.coursesReducer),
    EffectsModule.forFeature([CoursesEffect])
  ],
  declarations: [
    IndexComponent
  ],
  exports: [
    IndexComponent
  ]
})

export class CoursesModule {}
