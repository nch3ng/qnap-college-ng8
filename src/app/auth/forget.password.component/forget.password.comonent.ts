import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from '../../_services/confirm.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget.password.component.html',
  styleUrls: ['../auth.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  error = false;
  errMsg = '';
  signing = false;
  loading = false;
  sub: Subscription;
  seed = 'randomSeeds';
  tuid = '';
  token = '';
  aFormGroup: FormGroup;
  email = null;
  public readonly siteKey = environment.recaptchaV2Sitekey;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
  public badge: 'bottomright' | 'bottomleft' | 'inline' = 'bottomleft';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.sub = this.route.queryParams.subscribe(params => {
      // tslint:disable-next-line:no-string-literal
      this.seed = params['seed'];
    });
  }
  ngOnInit() {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required],
      email: ['', Validators.email]
    });
    this.authService.prepareForgetPassword(this.seed).subscribe(
      (res) => {
        // tslint:disable-next-line:no-string-literal
        this.token = res.payload['token'];
        // tslint:disable-next-line:no-string-literal
        this.tuid = res.payload['tuid'];
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSubmit(f: NgForm) {
    this.confirmService.open('Send the reset email link?').then(
      () => {
        console.log(f.value);
        this.authService.postForgetPassword(this.tuid, this.token, f.value.email).subscribe(
          (res) => {
            if (res.success) {
              this.toastr.success('Please check your email box for the reset email');
            } else {
              this.toastr.error(res.message);
            }
          },
          (err) => {
            this.toastr.error(err.message);
          }
        );
      }
    ).catch(() => {});
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
  }

  handleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
  }
  handleReady(): void {
    console.log('handle ready');
  }
  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
  }
}
