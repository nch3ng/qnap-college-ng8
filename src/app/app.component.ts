import { User } from './auth/_models/user.model';
import { Observable } from 'rxjs';
import { MetaService } from '@ngx-meta/core';
import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NgxScreensizeService } from './modules/ngx-screensize/_services/ngx-screensize.service';
import { AppState } from './reducers';
import { Store } from '@ngrx/store';
import { AuthActions } from './auth/action-types';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  loaded = false;

  constructor(
    private router: Router,
    private readonly meta: MetaService,
    @Inject(PLATFORM_ID) private platformId: object,
    private store: Store<AppState>) {
  }
  ngOnInit() {
    // Initial state
    const profile = JSON.parse(localStorage.getItem('currentUser')) as User;
    this.store.dispatch(AuthActions.login({user: profile}));
  }

  ngAfterViewInit() {
    this.meta.setTag('og:title', 'QNAP College');
    setTimeout(() => {
      this.loaded = true;
    }, 1000);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          (window as any).ga('set', 'page', event.urlAfterRedirects);
          (window as any).ga('send', 'pageview');
        }
      }
    });
  }

  ngOnDestroy() {}
}
