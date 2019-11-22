import { MetaService } from '@ngx-meta/core';
import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from './reducers';
import { AuthActions } from './auth/store/actions/action-types';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  loaded = false;
  currentUser;
  constructor(
    private router: Router,
    private readonly meta: MetaService,
    private store: Store<AppState>,
    @Inject(PLATFORM_ID) private platformId: object) {
  }
  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (!!currentUser && currentUser !== 'undefined') {
      this.store.dispatch(AuthActions.login({ user: JSON.parse(currentUser) }));
    }
  }

  ngAfterViewInit() {
    this.meta.setTag('og:title', 'QNAP College');
    setTimeout(() => {
      this.loaded = true;
    }, 1000);

    this.router.events.subscribe(event => {
      // console.log('siwth page')
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
