import { AppState } from './../reducers/index';
import { FacebookLoginProvider, GoogleLoginProvider, AuthService as SocialService } from 'angularx-social-login';
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
import { Subscription, noop } from 'rxjs';
import { PasswordService } from './_services/password.service';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { login } from './auth.actions';
import { AuthActions } from './action-types';

// declare let gapi: any;

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
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private socialService: SocialService,
    private ngZone: NgZone,
    private addScript: AddScriptService,
    private passwordService: PasswordService,
    private store: Store<AppState>) {

      this.seed = Math.floor(Math.random() * 10000000);
      this.sub = this.route.url.subscribe(
        (url) => {
          url[0].path === 'login' ? this.signin = true : this.signin = false;
        }
      );

      // gapi.load('auth2', () => {
      //   // console.log('[gapi.load] auth2 ready', )
      //   gapi.auth2.init({
      //     'clientId': environment.GoogleClientID
      //     // 'scope': 'profile'
      //     // 'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
      //   }).then((onInit) => {
      //     this.socialReady = true;
      //     console.log('qapi:auth2 loaded');
      //     this.GoogleAuth = gapi.auth2.getAuthInstance();

      //   }, (onError) => {
      //     this.loading = false;
      //     console.log(onError);

      //   });
      // });
  }
  ngOnInit() {
    this.signing = false;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.signing = false;
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    this.addScript.addMeta({
      name: 'google-signin-client_id',
      content: environment.GoogleClientID
    });

    const sitekey = environment.recapctchaSitekey;
    this.addScript.addScript('https://www.google.com/recaptcha/api.js', { render: sitekey });
  }

  onSignin(f: NgForm) {
    this.signing = true;
    this.loading = true;
    // console.log('on sign in')
    this.reCaptchaV3Service.execute(this.siteKey, 'login', (token) => {
      // console.log('recaptch');
      if (!token) {
        this.toastr.error('Something went wrong');
        this.loading = false;
        this.signing = false;
        return;
      }
      // console.log('This is your token: ', token);
      this.authService.login(f.value.email, f.value.password, token).pipe(
        tap((user: User) => {
          // console.log(user);
          if (user.role.level === 1 && this.returnUrl === '/admin') {
            this.returnUrl = '/admin/profile';
          }

          this.store.dispatch(AuthActions.login({user}));
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        })
      ).subscribe(
        noop,
        (error) => {
          console.error(error);
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
    this.loading = true;
    this.registering = true;
    this.reCaptchaV3Service.execute(this.siteKey, 'register', (token) => {
      if (!token) {
        this.toastr.error('Something went wrong');
        this.loading = false;
        this.registering = false;
        return;
      }
      // console.log('This is your token: ', token);
      this.authService.register(f.value.email, f.value.password, f.value.firstName, f.value.lastName).pipe(
        tap((res: any) => {
          this.loading = false;
          if (!res) {
            this.loading = false;
            this.registering = false;
            this.regError = true;
            this.regErrorMsg = "Oops, account exists. <a [routerLink]=\"['/login']\">Login</a> with your account?";
          } else {
            this.store.dispatch(AuthActions.login({user: res}));
            this.toastr.success('A validation email has been sent, please validate by clicking the link in email');
          }
        })
      ).subscribe(
        noop,
        (error) => {
          this.loading = false;
          this.registering = false;
          this.regError = true;
          this.regErrorMsg = "Oops, account exists. <a [routerLink]=\"['/login']\">Login</a> with your account?";;
          // this.toastr.error('Error');
        }
      );
    });
  }

  onFacebookLogin() {
    this.loading = true;
    this.socialService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) => {
      const requestBoody = {
        accessToken: user['authToken']
      };
      this.authService.fbLogin(requestBoody).pipe(
        tap((res: any) => {
          // console.log("[onFacebookLogin]", res);
          if (res.code === ResCode.PASSWORD_HAS_NOT_BEEN_CREATED) {

            this.router.navigate(['/user/create-password', res.uid], { queryParams: { token:  res.token, from: 'fb'} });
          } else {
            this.store.dispatch(AuthActions.login({user: res}));
            if (res.role.name === 'normal' && this.returnUrl === '/admin') {
              this.returnUrl = '/admin/profile';
            }
            this.router.navigate([this.returnUrl]);
          }
        })
      ).subscribe(noop,
        (error) => {
          console.error(error);
          this.loading = false;
          this.signing = false;
          this.loginError = true;
          this.loginErrorMsg = error.error.message;
        }
      );
    }).catch(error => {
      this.toastr.error('Facebook Login Error');
      this.loading = false;
    });
  }

  onGoogleLogin() {
    this.loading = true;
    this.signing = true;
    this.socialService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      // console.log('Angularx social login');
      // console.log(user);
      const authToken = user.idToken;
      this.toastr.success('Connected');
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.photoUrl,
        accessToken: authToken
      };

      this.authService.googleLogin(payload).pipe(
        tap((res: any) => {
          this.loading = false;
          this.signing = false;
          // console.log("[onFacebookLogin]", res);
          if (res.code === ResCode.PASSWORD_HAS_NOT_BEEN_CREATED) {
            this.router.navigate(['/user/create-password', res.uid], { queryParams: { token:  res.token, from: 'google'} });
          } else {
            this.store.dispatch(AuthActions.login({user: res}));
            if (res.role.name === 'normal' && this.returnUrl === '/admin') {
              this.returnUrl = '/admin/profile';
            }
            this._navigate([this.returnUrl]);
          }
        })
      ).subscribe(
        (res: any) => {
          this.loading = false;
          this.signing = false;
          // console.log("[onFacebookLogin]", res);
          if (res.code === ResCode.PASSWORD_HAS_NOT_BEEN_CREATED) {
            this.router.navigate(['/user/create-password', res.uid], { queryParams: { token:  res.token, from: 'google'} });
          } else {
            // console.log('logged in');
            // console.log(this.returnUrl)
            if (res.role.name === 'normal' && this.returnUrl === '/admin') {
              this.returnUrl = '/admin/profile';
            }
            // console.log('Navigate to', this.returnUrl);
            this._navigate([this.returnUrl]);
            // this.router.navigate([this.returnUrl]);
          }
        },
        (err: any) => {
          this.loading = false;
          this.signing = false;
          // console.log(err);
        }
      );
    }).catch(error => {
      this.loading = false;
      this.signing = false;
      console.log(error);
    });
    // console.log(this.GoogleAuth);
    // if (this.GoogleAuth) {
    //   this.GoogleAuth.signIn(
    //     {
    //       scope: 'profile email'
    //   }).then((googleUser) => {
    //     const id_token = googleUser.getAuthResponse().id_token;
    //     this.toastr.success('Connected');
    //     // console.log('signed in')
    //     const profile = googleUser.getBasicProfile();
    //     const payload = {
    //       id: profile.getId(),
    //       name: profile.getName(),
    //       email: profile.getEmail(),
    //       firstName: profile.getGivenName(),
    //       lastName: profile.getFamilyName(),
    //       picture: profile.getImageUrl(),
    //       accessToken: id_token
    //     }
    //     this.authService.googleLogin(payload).subscribe(
    //       (res: any) => {
    //         this.loading = false;
    //         this.signing = false;
    //         // console.log("[onFacebookLogin]", res);
    //         if (res.code === ResCode.PASSWORD_HAS_NOT_BEEN_CREATED) {
    //           this.router.navigate(['/user/create-password', res.uid], { queryParams: { token:  res.token, from: 'google'} });
    //         } else {
    //           // console.log('logged in');
    //           console.log(this.returnUrl)
    //           if (res.role.name === 'normal' && this.returnUrl == '/admin') {
    //               this.returnUrl = '/profile';
    //           }
    //           // console.log('Navigate to', this.returnUrl);
    //           this._navigate([this.returnUrl]);
    //           // this.router.navigate([this.returnUrl]);
    //         }
    //       },
    //       (err: any) => {
    //         this.loading = false;
    //         this.signing = false;
    //         // console.log(err); 
    //       }
    //     );
    //   },
    //   (error) => {
    //     // console.log('signed in failed, ', error);
    //     this.loading = false;
    //     this.signing = false;
    //   }).catch((err) => {
    //     this.loading = false;
    //     this.signing = false;
    //     // console.log(err)
    //   });
    // }
  }

  private _navigate(commands: any[]): void {
    this.ngZone.run(() => this.router.navigate(commands)).then();
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

    this.authService.resendVerification(this.uid).subscribe(
      (res) => {
        this.toastr.success("Validation email has been sent.");
      },
      (err) => {}
    );
  }

  inputPassword(f: NgForm) {
    console.log(this.passwordService.checkPassStrength(f.value.password));
    this.passwordStrength = this.passwordService.checkPassStrength(f.value.password);

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
