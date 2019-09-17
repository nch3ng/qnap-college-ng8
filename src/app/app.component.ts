import { MetaService } from '@ngx-meta/core';
import { Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';

import { NgxScreensizeService } from './modules/ngx-screensize/_services/ngx-screensize.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  loaded = false;
  constructor(private _ssService: NgxScreensizeService, private router: Router, private readonly _meta: MetaService) {
  }
  ngOnInit() {
  }

  ngAfterViewInit() {
    this._meta.setTag('og:title', 'QNAP College');
    setTimeout(() => {
      this.loaded = true;
    }, 1000);

    this.router.events.subscribe(event => {
      // console.log('siwth page')
      if (event instanceof NavigationEnd) {
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
      }
    });
  }

  ngOnDestroy() {}
}
