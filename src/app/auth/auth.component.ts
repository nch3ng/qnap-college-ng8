// import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook/dist/umd';
import { User } from './_models/user.model';
import { AuthService } from './_services/auth.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, NgZone, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReCaptchaV3Service, ReCaptcha2Component } from 'ngx-captcha';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import * as ResCode from '../_codes/response';
import { AddScriptService } from '../_services/addscript.service';
import { Subscription } from 'rxjs';
// import { ConfirmService } from '../_services/confirm.service';
// import { DomSanitizer } from '@angular/platform-browser';
import { PasswordService } from './_services/password.service';

declare var gapi: any;
declare var FB: any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy, AfterViewInit {
  signing = false;
  registering = false;
  returnUrl: string = null;
  signin: boolean;
  loginError = false;
  loginErrorMsg: any = '';
  verifyError = false;
  regError = false;
  regErrorMsg = '';
  loading = false;
  passwordStrength = '';
  seed: number;
  sub: Subscription;
  showPassword = false;
  showConfirmPassword = false;
  public readonly siteKey = environment.recapctchaSitekey;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
  public badge: 'bottomright' | 'bottomleft' | 'inline' = 'bottomleft';

  protected aFormGroup: FormGroup;

  GoogleAuth: any;

  uid = '';

  socialReady = false;

  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;
  @ViewChild('password', { static: false }) passwordField: ElementRef;
  @ViewChild('confirmPassword', { static: false }) confirmPasswordField: ElementRef;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private _toastr: ToastrService, 
    // private fb: FacebookService,
    private ngZone: NgZone,
    private _addScript: AddScriptService,
    private _passwordService: PasswordService) {
      console.log('auth init');
      // console.log(this._route.snapshot.url[0].path);
      this.seed = Math.floor(Math.random() * 10000000);

      this.sub = this._route.url.subscribe(
        (url) => {
          url[0].path === 'login' ? this.signin = true : this.signin = false;
        }
      );

      (window as any).fbAsyncInit = () => {
        FB.init({
          appId      : environment.FBId,
          cookie     : true,
          xfbml      : true,
          version    : 'v3.1'
        });
        FB.AppEvents.logPageView();
      };
      // FB call
      (function(d, s, id){
        // tslint:disable-next-line:no-var-keyword
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

      // let initParams: InitParams = {
      //   appId: environment.FBId,
      //   xfbml: true,
      //   version: 'v2.8'
      // };
      // fb.init(initParams);


      gapi.load('auth2', () => {
        console.log('[gapi.load] auth2 ready', )
        gapi.auth2.init({
          'clientId': environment.GoogleClientID
          // 'scope': 'profile'
          // 'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        }).then((onInit) => {
          this.socialReady = true;
          console.log('qapi:auth2 loaded');
          this.GoogleAuth = gapi.auth2.getAuthInstance();
          
        }, (onError) => {
          this.loading = false;
          console.log(onError);

        });
      });
  }
  ngOnInit() {
    this.signing = false;
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/admin';
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.signing = false;
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    this._addScript.addMeta({
      name: 'google-signin-client_id',
      content: environment.GoogleClientID
    })

    const sitekey = environment.recapctchaSitekey;
    this._addScript.addScript('https://www.google.com/recaptcha/api.js', { render: sitekey });
  }

  onSignin(f: NgForm) {
    this.signing = true;
    this.loading = true;
    this.reCaptchaV3Service.execute(this.siteKey, 'login', (token) => {
      if(!token) {
        this._toastr.error('Something went wrong');
        this.loading = false;
        this.signing = false;
        return;
      }
      // console.log('This is your token: ', token);
      this._authService.login(f.value.email, f.value.password, token).subscribe(
        (user: User) => {
          // console.log(user);
          if (user.role.level === 1 && this.returnUrl == '/admin') {
            this.returnUrl = '/profile';
          }
          this.loading = false;
          this._router.navigate([this.returnUrl]);
        },
        (error) => {
          console.log(error);
          this.signing = false;
          this.loading = false;
          
          if (error.error.payload && 
              error.error.payload.code && 
              error.error.payload.code === ResCode.EMAIL_IS_NOT_VERIFIED) {
            this.uid = error.error.payload.uid;
            this.verifyError = true;
          } else {
            this.loginError = true;
            this.loginErrorMsg = error.error.message;
          }
        }
      );
    });

  }

  onSignup(f: NgForm) {
    // console.log(f.value.email);
    // console.log(f.value.password);
    // console.log(f.value.confirm_password);

    this.loading = true;
    this.registering = true;
    this.reCaptchaV3Service.execute(this.siteKey, 'register', (token) => {
      if(!token) {
        this._toastr.error('Something went wrong');
        this.loading = false;
        this.registering = false;
        return;
      }
      // console.log('This is your token: ', token);
      this._authService.register(f.value.email, f.value.password, f.value.firstName, f.value.lastName).subscribe(
        (res: any) => {
          this.loading = false;
          console.log(res);
          if (!res) {
            this.loading = false;
            this.registering = false;
            this.regError = true;
            this.regErrorMsg = "Oops, account exists. <a [routerLink]=\"['/login']\">Login</a> with your account?";
          } else {
            this._toastr.success('A validation email has been sent, please validate by clicking the link in email');
          }
        },
        (error) => {
          this.loading = false;
          this.registering = false;
          this.regError = true;
          this.regErrorMsg = "Oops, account exists. <a [routerLink]=\"['/login']\">Login</a> with your account?";;
          // this._toastr.error('Error');
        }
      );
    });
  }

  onFacebookLogin() {
    this.loading = true;
    FB.login((response: any) => { 
        // console.log(response); 
        if (response && response.status === "connected") {
          const authRes = response.authResponse;
          this.loading = false;
          this._authService.fbLogin(authRes).subscribe(
            
            (res: any) => {
              // console.log("[onFacebookLogin]", res);
              if (res.code === ResCode.PASSWORD_HAS_NOT_BEEN_CREATED) {
                
                this._router.navigate(['/user/create-password', res.uid], { queryParams: { token:  res.token, from: 'fb'} });
              } else {
                if (res.role.name === 'normal' && this.returnUrl == '/admin') {
                  this.returnUrl = '/profile';
                }
                this._router.navigate([this.returnUrl]);
              }
            },
            (error) => {
              this.loading = false;
              console.log(error);
              this.signing = false;
              this.loginError = true;
              this.loginErrorMsg = error.error.message;
            }
          );
          this.loading = false;
          this._toastr.success('Connected');
        } else {
          this.loading = false;
          this._toastr.error('Something went wrong!');
        }
      }, {scope: 'email,public_profile'})

  }

  onGoogleLogin() {
    this.loading = true;
    this.signing = true;
    // console.log(this.GoogleAuth);
    if (this.GoogleAuth) {
      this.GoogleAuth.signIn(
        {
          scope: 'profile email'
      }).then((googleUser) => {
        const id_token = googleUser.getAuthResponse().id_token;
        this._toastr.success('Connected');
        // console.log('signed in')
        const profile = googleUser.getBasicProfile();
        const payload = {
          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          firstName: profile.getGivenName(),
          lastName: profile.getFamilyName(),
          picture: profile.getImageUrl(),
          accessToken: id_token
        }
        this._authService.googleLogin(payload).subscribe(
          (res: any) => {
            this.loading = false;
            this.signing = false;
            // console.log("[onFacebookLogin]", res);
            if (res.code === ResCode.PASSWORD_HAS_NOT_BEEN_CREATED) {
                
              this._router.navigate(['/user/create-password', res.uid], { queryParams: { token:  res.token, from: 'google'} });
            } else {
              // console.log('logged in');
              console.log(this.returnUrl)
              if (res.role.name === 'normal' && this.returnUrl == '/admin') {
                  this.returnUrl = '/profile';
              }
              // console.log('Navigate to', this.returnUrl);
              this._navigate([this.returnUrl]);
              // this._router.navigate([this.returnUrl]);
            }
          },
          (err: any) => {
            this.loading = false;
            this.signing = false;
            // console.log(err); 
          }
        );
      },
      (error) => {
        // console.log('signed in failed, ', error);
        this.loading = false;
        this.signing = false;
      }).catch((err) => {
        this.loading = false;
        this.signing = false;
        // console.log(err)
      });
    }
  }

  private _navigate(commands: any[]): void {
    this.ngZone.run(() => this._router.navigate(commands)).then();
  }

  onCheckPassword(f: NgForm) {
    if (f.value.password !== f.value.confirm_password) {
      this.regError = true;
      this.regErrorMsg = 'Password doesn\'t match';
    } else {
      this.regError = false;
    }
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
    this.cdr.detectChanges();
  }
  handleReady():void {
    console.log('handle ready');
  }
  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
  }

  resend() {

    this._authService.resendVerification(this.uid).subscribe(
      (res) => {
        this._toastr.success("Validation email has been sent.");
      },
      (err) => {}
    );
  }

  inputPassword(f: NgForm) {
    console.log(this._passwordService.checkPassStrength(f.value.password));
    this.passwordStrength = this._passwordService.checkPassStrength(f.value.password);

  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.passwordField.nativeElement.type === 'password' ? this.passwordField.nativeElement.type = 'text' : this.passwordField.nativeElement.type = 'password';
  }

  toggleConfirmPassword() {
    console.log(this.confirmPasswordField.nativeElement.value);
    this.showConfirmPassword = !this.showConfirmPassword;
    this.confirmPasswordField.nativeElement.type === 'password' ? this.confirmPasswordField.nativeElement.type = 'text' : this.confirmPasswordField.nativeElement.type = 'password';
  }
}
