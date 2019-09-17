import { MetaService } from '@ngx-meta/core';
import { NgxScreensizeService } from './modules/ngx-screensize/_services/ngx-screensize.service';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const screenSizeServiceSpy = jasmine.createSpyObj('NgxScreensizeService', ['getScreensize']);
  const metaServiceSpy = jasmine.createSpyObj('metaServiceSpy', ['setTag']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: NgxScreensizeService, useValue: screenSizeServiceSpy },
        { provide: MetaService, useValue: metaServiceSpy }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
