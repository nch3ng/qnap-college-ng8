import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { ModalModule } from 'ngx-modialog';
import { AuthModule } from './auth/auth.module';
import { CourseResolver } from './pages/course/course.resolver';
import { CatCourseResolver } from './pages/category/cat.course.resolver';
import { CategoryService } from './_services/category.service';
import { CategoryResolver } from './pages/index/category.resolver';
import { CourseService } from './_services/course.service';
import { CoursesResolver } from './pages/index/courses.resolver';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PagesModule } from './pages/pages.module';
import { MomentModule } from 'ngx-moment';
import { NgxScreensizeModule } from './modules/ngx-screensize/index';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MetaModule, MetaLoader, metaFactory } from '@ngx-meta/core';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';
import { ToastrModule } from 'ngx-toastr';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'college.qnap.com'
  },
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#f1d600'
    }
  },
  revokable: true,
  content: {
    dismiss: 'Agree'
  },
  layout: 'cc-qnap',
  layouts: {
    'cc-qnap': '<span id="cookieconsent:desc" class="cc-message">{{message}}</span>{{dismiss}}',
  },
  elements: {
    message: 'This site uses cookies in order to improve ' +
      'your user experience and to provide content tailored ' +
      // tslint:disable-next-line:max-line-length
      'specifically to your interests. By continuing to browse our site you agree to our use of cookies, <a href="//www.qnap.com/go/privacy-notice" target="_blank">Data Privacy Notice</a> and <a href="//www.qnap.com/terms-of-use" target="_blank">Terms of Use / Service</a>',
  }
};
@NgModule({
  declarations: [
    AppComponent,
    MaintenanceComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'qnap-college' }),
    AppRoutingModule,
    NgxPageScrollCoreModule,
    FontAwesomeModule,
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: (metaFactory)
    }),
    NgcCookieConsentModule.forRoot(cookieConfig),
    NgxScreensizeModule,
    MomentModule,
    PagesModule,
    ToastrModule.forRoot(),
    AuthModule.forRoot(),
    ModalModule.forRoot(),
    BootstrapModalModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([AppEffects]),
  ],
  providers: [
    CoursesResolver,
    CourseService,
    CategoryResolver,
    CategoryService,
    CatCourseResolver,
    CourseResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
