import { AppState } from './../reducers/index';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { AuthService } from './../auth/_services/auth.service';
import { OnInit, AfterViewInit, OnDestroy, Component } from '@angular/core';
import { Location } from '@angular/common';
import { EventBrokerService, IEventListener } from '../_services/event.broker.service';
import { Store } from '@ngrx/store';
import { AuthActions } from '../auth/store/actions';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {

  // loggedIn: boolean;
  routeSub: Subscription;
  loading = false;
  returnUrl = '/admin/profile';

  private myEventListener: IEventListener;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private location: Location,
    private eventBroker: EventBrokerService,
    private store: Store<AppState>) {
    // this.loggedIn = this.authService.loggedIn;
    this.myEventListener = this.eventBroker.listen<boolean>('loading', (value: boolean) => {
      // Waiting loading event in router-outlet, it's a workaround, because we don't have broker on router-outlet
      this.loading = value;
    });
  }

  ngOnInit() {
    // tslint:disable-next-line:no-string-literal
    this.returnUrl =  this.route.snapshot['_routerState'] && this.route.snapshot['_routerState'].url;
    this.route.params.subscribe(
      () => {
        // console.log('params changed');
      }
    );
  }

  ngAfterViewInit() {
    this.routeSub = this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        } else if (
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel
            ) {
          this.loading = false;
        }
    });
  }

  ngOnDestroy() {}

  onSignout() {
    this.store.dispatch(AuthActions.adminLogout());
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.returnUrl}});
    // location.reload();
  }

  onSetLoading(event) {
    // console.log(event);
  }

}
