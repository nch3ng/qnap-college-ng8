import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/_services/auth.service';
import { AddThisService } from '../_services/addthis.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxScreensizeService } from '../modules/ngx-screensize/_services/ngx-screensize.service';
import { ModalService } from '../_services/modal.service';
import { Router, ActivatedRoute, RouteConfigLoadEnd, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { IEventListener, EventBrokerService } from '../_services/event.broker.service';
import { Component, OnInit, ElementRef, ViewChild, HostListener, AfterViewInit, OnDestroy, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { SearchService } from '../_services/search.service';
import { NgcCookieConsentService, NgcInitializeEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { DeviceDetectorService } from 'ngx-device-detector';
import reframe from 'reframe.js';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('header', { static: false}) headerEl: ElementRef;
  private sub: any;
  private routeSub: any;
  private modalPopSub: any;
  private modalCloseSub: any;
  private youtubeSrc: any;
  private youtubeRef: string;

  public bannerShow: boolean;
  public goToTop: boolean;
  public loading: boolean;
  public keywords: string;
  public modalOpen: boolean;
  public firstOpened: boolean;

  private currentUser: any = false;
  private loggedIn = false;
  private YT: any;
  private video: any;
  private player: any;
  private reframed = false;
  private youtubeVideoWidth = 853;
  private youtubeVideoHeight = 480;
  private returnUrl = '/';
  deviceInfo: any = null;

  // tslint:disable-next-line:variable-name
  _headerHTML = '';
  // tslint:disable-next-line:variable-name
  footerHTML$: Observable<any>;
  private addThisSub: Subscription;
  // keep refs to subscriptions to be able to unsubscribe later
  private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;
  private initializeSubscription: Subscription;
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;
  // tslint:disable-next-line: variable-name
  private _myEventListener: IEventListener;

  @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
    // console.log(event);
    const x = event.keyCode;
    if (x === 27) {
      // Escape/ESC button;
      this.onCloseModal();
    }
  }

  @HostListener('window:orientationchange', ['$event'])
  handleOC() {
    this.youtubeVideoWidth = this.ssService.getScreensize().x;
  }

  @HostListener('window:scroll', ['$event'])
  currentPosition() {
    if (window.pageYOffset > this.headerEl.nativeElement.offsetHeight) {
      this.goToTop = true;
    } else {
      this.goToTop = false;
    }
  }

  constructor(
    private router: Router,
    private searchService: SearchService,
    private modalService: ModalService,
    private ccService: NgcCookieConsentService,
    private deviceService: DeviceDetectorService,
    private ssService: NgxScreensizeService,
    private sanitizer: DomSanitizer,
    private addThis: AddThisService,
    private eventBroker: EventBrokerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object) {

      let headers = new HttpHeaders();
      headers = headers.append('Origin', 'https://college.qnap.com');
      this.footerHTML$ = this.httpClient
        // tslint:disable-next-line:max-line-length
        .get('https://www.qnap.com/i/_aid/footer.php?lang_set=en-us&lc_demo=/solution/virtualization-station-3/en/&is_external=1&is_external=1', {responseType: 'text'});
  }

  ngOnInit() {

    this.deviceInfo = this.deviceService.getDeviceInfo();
    // console.log(this.deviceInfo);
    const url = this.router.url;
    this.checkBanner(url);
    // tslint:disable-next-line:no-string-literal
    this.returnUrl =  this.route.snapshot['_routerState'] && this.route.snapshot['_routerState'].url;
    this._myEventListener = this.eventBroker.listen<boolean>('loading', (value: boolean) => {
      // Waiting loading event in router-outlet, it's a workaround, because we don't have broker on router-outlet
      this.loading = value;
    });
    const tag = document.createElement('script');
    tag.src = '//www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    this.authService.verify().subscribe(
      (res) => {
        if (res && res.success) {
          this.loggedIn = true;
          this.currentUser = this.authService.getUser();
          // console.log(this.currentUser);
          // this.currentUserAbbvName = this.currentUser.name.split(" ").map((n)=>n[0]).join("")
        }
      },
      (err) => {
        console.log(err);
      }
    );
    this.loading = true;
    this.goToTop = false;
    this.modalOpen = false;
    this.firstOpened = false;
    this.youtubeSrc = 'https://www.youtube.com/embed/ShnVe3QReRk';

    this.sub = this.searchService.search.subscribe(
      (keywords) => {
        setTimeout(() => { this.keywords = keywords; }, 0);
      }
    );

    this.modalPopSub = this.modalService.pop.subscribe(
      (youtubeRef: string) => {
        this.youtubeRef = youtubeRef;
        this.youtubeSrc = 'https://www.youtube.com/embed/' + youtubeRef;
        this.modalOpen = true;
        this.firstOpened = true;
        // this.reCaptchaV3Service.execute(environment.recapctchaSitekey, 'modal pop', (token) => {
        //   console.log('This is your token: ', token);
        // });
        let startTime = 0;
        if (isPlatformBrowser(this.platformId)) {
          if (localStorage.getItem(this.youtubeRef)) {
            startTime = +localStorage.getItem(this.youtubeRef);
          }
        }
        this.player.loadVideoById(this.youtubeRef, startTime);
      }
    );

    this.modalCloseSub = this.modalService.close.subscribe(
      () => {
        // console.log(this.player.getCurrentTime());
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.youtubeRef.toString(), this.cleanTime().toString());
        }
        this.modalOpen = false;
        this.youtubeSrc = '';
        this.youtubeRef = '';
        this.player.stopVideo();
      }
    );

    // subscribe to cookieconsent observables to react to main events
    // this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
    //   () => {
    //     // you can use this.ccService.getConfig() to do stuff...
    //     // console.log('popupOpen');
    //   });

    // this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
    //   () => {
    //     // you can use this.ccService.getConfig() to do stuff...
    //     // console.log('popuClose');
    //   });

    // this.initializeSubscription = this.ccService.initialize$.subscribe(
    //   (event: NgcInitializeEvent) => {
    //     // you can use this.ccService.getConfig() to do stuff...
    //     console.log(`initialize: ${JSON.stringify(event)}`);
    //   });

    // this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
    //   (event: NgcStatusChangeEvent) => {
    //     // you can use this.ccService.getConfig() to do stuff...
    //     // console.log(`statusChange: ${JSON.stringify(event)}`);
    //   });

    // this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
    //   () => {
    //     // you can use this.ccService.getConfig() to do stuff...
    //     // console.log(`revokeChoice: ${JSON.stringify(event)}`);
    //   });
  }
  ngAfterViewInit() {
    // console.log(this.returnUrl);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (window as any).ga('set', 'page', event.urlAfterRedirects);
        (window as any).ga('send', 'pageview');
      }
    });

    if (this.ssService.getScreensize().x <= 768 ) {
      this.youtubeVideoWidth = this.ssService.getScreensize().x;
      this.youtubeVideoHeight = Math.trunc(this.youtubeVideoWidth * (480 / 853));
    }

    // tslint:disable-next-line:no-string-literal
    window['onYouTubeIframeAPIReady'] = (e) => {
      // tslint:disable-next-line:no-string-literal
      this.YT = window['YT'];
      this.reframed = true;
      // tslint:disable-next-line:no-string-literal
      this.player = new window['YT'].Player('player', {
        videoId: this.youtubeRef,
        width: this.youtubeVideoWidth,
        height: this.youtubeVideoHeight,
        playsinline: 0,
        events: {
          // tslint:disable-next-line:object-literal-key-quotes
          'onStateChange': this.onPlayerStateChange.bind(this),
          // tslint:disable-next-line:object-literal-key-quotes
          'onError': this.onPlayerError.bind(this),
          // tslint:disable-next-line:object-literal-key-quotes
          'onReady': (event) => {
            if (!this.reframed) {
              this.reframed = true;
              reframe(event.target.a);
            }
          }
        }
      });
    };
    // console.log(this.ccService.getConfig());
    this.routeSub = this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
            this.loading = true;

            // console.log('Navigate start');
        } else if (
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel
            ) {
            this.loading = false;
            // console.log(this.router.url);
            this.checkBanner(this.router.url);
            // console.log('Navigate end');
        } else if ( event instanceof RouteConfigLoadEnd) {
        }
    });

    if (window.pageYOffset > this.headerEl.nativeElement.offsetHeight) {
      setTimeout(() => { this.goToTop = true; });
    }
    // console.log(this.el.nativeElement.offsetHeight);
    setTimeout(() => { this.loading = false; }, 0);
    this.addThisSub = this.addThis.initAddThis('ra-5a0dd7aa711366bd', false).subscribe();
    // tslint:disable-next-line:max-line-length
    // this.httpClient.get('https://www.qnap.com/i/_aid/header.php?lang_set=en-us&lc_demo=/solution/virtualization-station-3/en/', {responseType: 'text'}).subscribe(
    //   (data) => {
    //     setTimeout(() => {
    //       this._headerHTML = data;
    //     }, 2000);
    //   },
    //   (error) => {
    //   }
    // );
    // this.loadScript('//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5a0dd7aa711366bd');
    // tslint:disable-next-line:max-line-length
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.routeSub.unsubscribe();
    this.modalPopSub.unsubscribe();

    // unsubscribe to cookieconsent observables to prevent memory leaks
    // this.popupOpenSubscription.unsubscribe();
    // this.popupCloseSubscription.unsubscribe();
    // this.initializeSubscription.unsubscribe();
    // this.statusChangeSubscription.unsubscribe();
    // this.revokeChoiceSubscription.unsubscribe();
    this.addThisSub.unsubscribe();
  }

  onSubmit(f: NgForm) {
    this.router.navigate(['/search', f.value.keywords], { queryParams: { q: f.value.keywords } });
  }

  onCloseModal() {
    this.modalService.closeModal();
  }

  private checkBanner(url) {
    if (url === '/' || url.indexOf('/category/') !== -1 || url.indexOf('/search/') !== -1) {
      // banner only appears in home, category, and search pages
      this.bannerShow = true;
    } else {
      this.bannerShow = false;
    }
  }

  // utility
  cleanTime() {
    return Math.round(this.player.getCurrentTime());
  }

  onPlayerStateChange(event) {
    // console.log(event);
    switch (event.data) {
      // tslint:disable-next-line:no-string-literal
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() === 0) {
          // console.log('started ' + this.cleanTime());
        } else {
          // console.log('playing ' + this.cleanTime());
        }
        break;
      // tslint:disable-next-line:no-string-literal
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() !== 0) {
          // console.log('paused' + ' @ ' + this.cleanTime());
        }
        break;
      // tslint:disable-next-line:no-string-literal
      case window['YT'].PlayerState.ENDED:
        // console.log('ended ');
        break;
    }
  }

  onPlayerError(event) {
    switch (event.data) {
      case 2:
        // console.log('' + this.video);
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    }
  }

  onSignout(e) {
    e.stopPropagation();
    // remove user from local storage to log user out
    this.loading = true;
    this.loggedIn = false;
    this.authService.logout('/');
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
  private loadScript(script) {
    const body = document.body as HTMLDivElement;
    const scriptDOM = document.createElement('script');
    scriptDOM.innerHTML = '';
    scriptDOM.src = script;
    scriptDOM.async = true;
    scriptDOM.defer = true;
    body.appendChild(scriptDOM);
  }
}
