import { AuthService } from './../auth/_services/auth.service';
import { AddThisService } from './../_services/addthis.service';
import { NgxScreensizeService } from './../modules/ngx-screensize/_services/ngx-screensize.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ModalService } from './../_services/modal.service';
import { TermsOfUseComponent } from './termsofuse/termsofuse.component';
import { CourseComponent } from './course/course.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CategoryComponent } from './category/category.component';
import { IndexComponent } from './index/index.component';
import { PipesModule } from './../_pipes/pipes.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgcCookieConsentModule, NgcCookieConsentService, WindowService } from 'ngx-cookieconsent';
import { NgPipesModule } from 'ngx-pipes';
import { MomentModule } from 'ngx-moment';
import { PagesRoutingModule } from './pages-routing.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesComponent } from './pages.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { SecurityModule } from '../admin/_directives/security.module';
import { SafePipe } from '../_pipes/safe.pipe';
import { SearchComponent } from './search/search.component';
import { SearchService } from '../_services/search.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventBrokerService } from '../_services/event.broker.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('PagesComponent', () => {
  let component: PagesComponent;
  let fixture: ComponentFixture<PagesComponent>;
  const searchServiceSpy = jasmine.createSpyObj('SearchService', ['emit']);
  const modalServiceSpy = jasmine.createSpyObj('ModalService', ['popModal', 'closeModal']);
  const cookieConsentServiceSpy = jasmine.createSpyObj('NgcCookieConsentService', [
    'popupOpen$', 'popupClose$', 'initialize$', 'statusChange$', 'revokeChoice$' ]);
  const deviceDetectServiceSpy = jasmine.createSpyObj('DeviceDetectService', ['getDeviceInfo']);
  const screenSizeServiceSpy = jasmine.createSpyObj('NgxScreensizeService', ['getScreensize']);
  const addThisServiceSpy = jasmine.createSpyObj('AddThisService', ['initAddThis']);
  const eventBrokerServiceSpy = jasmine.createSpyObj('EventBrokerService', ['listen']);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['verify', 'getUser']);

  let authService: any;
  let searchService: any;
  let modalService: any;
  let route: any;
  let ccService: any;
  let ssService: any;
  let addthisService: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
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
        PipesModule,
        RouterTestingModule
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
        { provide: ActivatedRoute, useValue: {
          snapshot: {
            routerState: {
              url: '/'
            }
          }
        }},
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy },
        { provide: NgcCookieConsentService, useValue: cookieConsentServiceSpy },
        { provide: DeviceDetectorService, useValue: deviceDetectServiceSpy},
        { provide: NgxScreensizeService, useValue: screenSizeServiceSpy },
        { provide: AddThisService, useValue: addThisServiceSpy },
        { provide: EventBrokerService, useValue: eventBrokerServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AddThisService, useValue: addThisServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesComponent);
    component = fixture.componentInstance;
    route = TestBed.get(ActivatedRoute);
    authService = TestBed.get(AuthService);
    searchService = TestBed.get(SearchService);
    modalService = TestBed.get(ModalService);
    ccService = TestBed.get(NgcCookieConsentService);
    ssService = TestBed.get(NgxScreensizeService);
    addthisService = TestBed.get(AddThisService);

    authService.verify.and.returnValue(of({success: true,  message: 'You are authorized.'}));
    authService.getUser.and.returnValue({});
    searchService.search = of('keyword');
    modalService.pop = of([]);
    modalService.close = of([]);
    ccService.popupOpen$.and.returnValue(of([]));
    ccService.popupClose$.and.returnValue(of([]));
    ssService.getScreensize.and.returnValue({
      x: 1024
    });
    addthisService.initAddThis.and.returnValue(of([]));
    (component as any).player = {
      loadVideoById: () => {},
      getCurrentTime:  () => {},
      stopVideo: () => {}
    };
    // ccService.popupClose$.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    // (authService.verify as jasmine.Spy).and.returnValue(of([{success: true}]));
    expect(component).toBeTruthy();
  });
});
