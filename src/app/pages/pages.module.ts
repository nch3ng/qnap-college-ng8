import { NotFoundComponent } from './not-found/not-found.component';
import { TermsOfUseComponent } from './termsofuse/termsofuse.component';
import { AddScriptService } from './../_services/addscript.service';
import { ConfirmService } from './../_services/confirm.service';
import { CommentsService } from './../_services/comment.service';
import { CourseComponent } from './course/course.component';
import { CategoryService } from './../_services/category.service';
import { CategoryComponent } from './category/category.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { PipesModule } from './../_pipes/pipes.module';
import { FavService } from './../_services/favorite.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IndexComponent } from './index/index.component';
import { AuthService } from './../auth/_services/auth.service';
import { AddThisService } from './../_services/addthis.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgcCookieConsentModule, NgcCookieConsentService } from 'ngx-cookieconsent';
import { ModalService } from './../_services/modal.service';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { NgPipesModule } from 'ngx-pipes';
import { MomentModule } from 'ngx-moment';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchService } from '../_services/search.service';
import { HttpClientModule } from '@angular/common/http';
import { EventBrokerService } from '../_services/event.broker.service';
import { SafePipe } from '../_pipes/safe.pipe';
import { SecurityModule } from '../admin/_directives/security.module';
import { UsersService } from '../auth/_services/users.service';
import { SearchComponent } from './search/search.component';
import { SearchResolver } from './search/search.resolver';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxPageScrollModule,
    PagesRoutingModule,
    MomentModule,
    NgPipesModule,
    NgcCookieConsentModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgxCaptchaModule,
    SecurityModule,
    PipesModule
  ],
  declarations: [
    PagesComponent,
    IndexComponent,
    SafePipe,
    CategoryComponent,
    SearchComponent,
    NotFoundComponent,
    // RunScriptsDirective,
    CourseComponent,
    TermsOfUseComponent,
  ],
  providers: [
    SearchService,
    ModalService,
    NgcCookieConsentService,
    DeviceDetectorService,
    AddThisService,
    EventBrokerService,
    AuthService,
    FavService,
    CategoryService,
    UsersService,
    CommentsService,
    ConfirmService,
    AddScriptService,
    SearchResolver
  ]
})
export class PagesModule { }
