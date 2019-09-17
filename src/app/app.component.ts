import { MetaService } from '@ngx-meta/core';
import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NgxScreensizeService } from './modules/ngx-screensize/_services/ngx-screensize.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  loaded = false;
  constructor(
    private ssService: NgxScreensizeService,
    private router: Router,
    private readonly meta: MetaService,
    @Inject(PLATFORM_ID) private platformId: object) {
  }
  ngOnInit() {
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
