import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

// import { environment } from '../../../environments/environment.dev';
import { VerificationSuccessComponent } from './success.component/success.component';
import { VerificationFailedComponent } from './failure.component/failure.component';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import * as ResponseCode from '../../_codes/response';

@Component({
  selector: 'verification',
  template: '<div #container><span>Verifiing...</span></div>'
})
export class VerificationComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Verification Component';
  private sub: any;
  private querySub: any;
  valid = true;
  private uid: string;
  private token: string;
  private reset = false;

  @ViewChild('container', { static: false}) container: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private _route: ActivatedRoute,
    private authService: AuthService) {}

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {

      this.uid = params['id'];
    });

    this.querySub = this._route.queryParams.subscribe(params => {

      this.token = params['token'];
      this.reset = +params['reset'] === 1 ? true : false;
    });
  }
  ngAfterViewInit() {
    this.authService.verifyEmail(this.uid, this.token, this.reset).subscribe(
      (res: any) => {
        // this._router.navigate([this.returnUrl]);
        console.log('[Validation Component]: ', res)
        if (res.success) {
          setTimeout( () => { this.loadComponent(VerificationSuccessComponent, res.code, {token: this.token, uid: this.uid});}, 0);
        }
      },
      (res: any) => {
        const error = res.error;
        if (!error.success) {
          setTimeout( () => { this.loadComponent(VerificationFailedComponent, error.error_code, {token: this.token, uid: this.uid});}, 0);
        } 
        else {
          setTimeout( () => { this.loadComponent(VerificationFailedComponent, ResponseCode.GENERAL_ERROR, {token: this.token, uid: this.uid});}, 0);
        }
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.querySub.unsubscribe();
  }

  loadComponent(component: any, code?: number, payload?: any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.container.clear();
    let el : HTMLElement = this.container.element.nativeElement;
    el.innerHTML = '';

    const ref: any = this.container.createComponent(factory, 0);
    ref.instance.message = "";
    ref.instance.payload = payload;

    if(code) {
      ref.instance.type = code;
    }

    ref.changeDetectorRef.detectChanges();
  }
}
