import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { AuthService } from './../auth/_services/auth.service';
import { OnInit, AfterViewInit, OnDestroy, Component } from '@angular/core';
import { Location } from '@angular/common';
import { EventBrokerService, IEventListener } from '../_services/event.broker.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {

  loggedIn: boolean;
  routeSub: Subscription;
  loading = false;

  private _myEventListener: IEventListener;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _location: Location,
    private _eventBroker: EventBrokerService) {
    this.loggedIn = this._authService.loggedIn;
    this._myEventListener = this._eventBroker.listen<boolean>("loading",(value:boolean)=>{
      // Waiting loading event in router-outlet, it's a workaround, because we don't have broker on router-outlet
      this.loading = value;
    });
  }

  ngOnInit() {
    this._route.params.subscribe(
      () => {
        // console.log('params changed');
      }
    );
  }

  ngAfterViewInit() {
    this.routeSub = this._router.events
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

  onSignout () {
    console.log('signout');
    this._authService.logout();
    // this._router.navigateByUrl('/admin');
    location.reload();
  }

  onSetLoading(event) {
    console.log(event);
  }

}
