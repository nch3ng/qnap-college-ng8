
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ResCode from '../../_codes/response';
import { AuthService } from '../_services/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmService } from '../../_services/confirm.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PasswordService } from '../_services/password.service';

@Component({
  templateUrl: './create.password.component.html',
  styleUrls: ['./create.password.component.scss']
})

export class CreatePasswordComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('alertBox', { static: false}) alertBox: ElementRef;

  valid = false;
  private token: string = null;
  private uid: string;
  private sub: Subscription;
  private routeSub: Subscription;
  private creating = false;
  createError = false;
  createErrorMsg: string = null;

  showPassword = false;
  showConfirmPassword = false;
  passwordStrength = '';

  @ViewChild('password', { static: false }) passwordField: ElementRef;
  @ViewChild('confirmPassword', { static: false }) confirmPasswordField: ElementRef;

  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private renderer: Renderer2,
    private _toastr: ToastrService,
    private _router: Router,
    private _passwordService: PasswordService
  ) {
    this.sub = this._route.params.subscribe(params => {
      // console.log(params);
      this.uid = params['id'];
    });
      this.routeSub = this._route.queryParams.subscribe(params => {
        // console.log(params);
        this.token = params['token'];
      });
    }
  ngOnInit() {
    this._authService.tmpVerify(this.token).subscribe(
      (data) => {

        if (data && data.success) {
          this.valid = true;
        } else {
          this.renderer.setStyle(this.alertBox.nativeElement, 'display', 'block');
          this.valid = false;
        }
        // console.log(data);
      }, 
      (error) => {
        this.valid = false;
        // console.log(error);
      });

      // console.log(this.valid);
  }
  ngAfterViewInit() {
    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  resend() {
    this._authService.resendVerification(this.uid).subscribe(
      (res) => {
        this._toastr.success('Success');
      },
      (err) => {
        this.createError = true;
        this.createErrorMsg = err;
      }
    );
  }

  onCreate(f: NgForm) {
    if (f.value.password !== f.value.confirm_password){
      this._toastr.error('Password doesn\'t match');
      return false;
    }
    this.creating = true;
    this._authService.createPassword(this.uid, this.token, f.value.password).subscribe(
      (data) => {
        // console.log(data);
        this._toastr.success('Successfully created a password, please login.');
        this._router.navigate(['/login'])
      },
      (err) => {
        this._toastr.error('Failed to create a password, please contact admistrator for further assistance.');
      }
    );
  }

  onCheckPassword(f: NgForm) {
    // console.log('Check Password');
    // console.log(f.value.password);
    // console.log(f.value.cPassword);
    if (f.value.password !== f.value.confirm_password) {
      this.createError = true;
      this.createErrorMsg = 'Password doesn\'t match';
    } else {
      this.createError = false;
    }
  }

  inputPassword(f: NgForm) {
    console.log(this._passwordService.checkPassStrength(f.value.password));
    this.passwordStrength = this._passwordService.checkPassStrength(f.value.password);

  }

  togglePassword() {
    console.log(this.passwordField.nativeElement.type);
    this.showPassword = !this.showPassword;
    this.passwordField.nativeElement.type === 'password' ? this.passwordField.nativeElement.type = 'text' : this.passwordField.nativeElement.type = 'password';
  }

  toggleConfirmPassword() {
    console.log(this.confirmPasswordField.nativeElement.value);
    this.showConfirmPassword = !this.showConfirmPassword;
    this.confirmPasswordField.nativeElement.type === 'password' ? this.confirmPasswordField.nativeElement.type = 'text' : this.confirmPasswordField.nativeElement.type = 'password';
  }
}
