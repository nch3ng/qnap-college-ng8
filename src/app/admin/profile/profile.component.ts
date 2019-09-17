import { EventBrokerService } from './../../_services/event.broker.service';
import { ToastrService } from 'ngx-toastr';
import { AuthResponse } from './../../_models/authresponse';
import { AuthService } from './../../auth/_services/auth.service';
import { NgForm } from '@angular/forms';
import { User } from './../../auth/_models/user.model';
import { OnInit, AfterViewInit, OnDestroy, Component, ElementRef, ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ConfirmService } from '../../_services/confirm.service';
import { Location } from '@angular/common';
import { UsersService } from '../../auth/_services/users.service';
import { PasswordService } from '../../auth/_services/password.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('tabState', [
      state('inactive', style({
        display: 'none',
        opacity: 0
      })),
      state('active',   style({
        display: 'block',
        opacity: 1
      })),
      transition('inactive => active', animate('.2s ease-in')),
      transition('active => inactive', animate('0s ease-out'))
    ])
  ]
})

export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {

  app = 'profile';
  tab = 1;
  user: User;
  confirm_email = '';
  confirmError = false;
  tabs = [
    { id: 1, name: 'Information', state: 'active' },
    { id: 2, name: 'Change Password', state: 'inactive'},
    { id: 3, name: 'Account', state: 'inactive'}
  ];

  error: boolean;
  errorMsg = '';

  old_password = '';
  password = '';
  confirm_password = '';
  confirmOpen = false;
  firstName = '';
  lastName = '';
  showPassword = false;
  showOldPassword = false;
  showConfirmPassword = false;
  passwordStrength = '';

  @ViewChild('Password', { static:  false}) passwordField: ElementRef;
  @ViewChild('oldPassword', { static:  false}) oldPasswordField: ElementRef;
  @ViewChild('confirmPassword', { static:  false}) confirmPasswordField: ElementRef;

  constructor(
    private authService: AuthService,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private userService: UsersService,
    private eventBroker: EventBrokerService,
    private passwordService: PasswordService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.firstName = this.user.firstName;
    this.lastName = this.user.lastName;
    this.error = false;
    this.errorMsg = '';
  }
  ngOnInit() {}

  ngAfterViewInit() {
  }

  ngOnDestroy() {}

  setloading(value: boolean) {
    // console.log('setloading');
    this.eventBroker.emit<boolean>('loading', value);
  }

  selectTab(tab) {
    this.tab = tab;
    for (const t of this.tabs) {
      t.state = 'inactive';
    }

    // console.log(this.tab);

    this.tabs[this.tab - 1].state = 'active';
  }

  onSubmit(f: NgForm) {
    // console.log(this.old_password);
    // console.log(this.password);
    // console.log(this.confirm_password);

    this.confirmService.open('Are you sure you want to change password?').then(
      () => {

        console.log(this.password);
        console.log(this.confirm_password)
        if (this.password !== this.confirm_password) {
          this.error = true;
          this.errorMsg = 'Confirmed password does not match';
          return;
        } else {
          this.authService
            .changePassword(this.user.email, this.old_password, this.password).subscribe(
              (res: AuthResponse) => {
                this.toastr.success(res.message);
                this.authService.logout();
                location.reload();
              },
              (error) => {
                this.toastr.error(error.message);
              }
            );
        }
      },
      () => {
      }
    );
  }

  onDeleteAccount(user) {
    if (!this.confirmOpen) {
      this.confirmOpen = true;
      return;
    }

    if (this.user.email !== this.confirm_email) {
      this.confirmError = true;
      this.confirmService.alert('Please confirm your email');
      return;
    } else {
      this.confirmService.open('Once you delete your account, there is no going back. Please be certain.').then(() => {
        this.setloading(true);
        this.userService.destroy().subscribe(
          (res) => {
            setTimeout(() => {
              this.setloading(false);
              this.authService.logout();
              location.reload();
            }, 1000);
          },
          (err) => {
            this.toastr.error('Something went wrong, please contact admistrator');
          }
        );
      }).catch(() => {});
    }
  }

  onChangeName(f) {
    this.confirmService.open('Are you sure you want to change name').then(
      () => {
        this.setloading(true);
        this.userService.updateName(this.firstName, this.lastName).subscribe(
          (res: any) => {
            this.user = res.payload;
            this.updateContent();
            console.log(res);
            this.toastr.success('Success');
            this.setloading(false);
          },
          (err) => {
            console.log(err);
          });
      }
    ).catch(e => {});
  }

  updateContent() {
    this.firstName = this.user.firstName;
    this.lastName = this.user.lastName;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.firstName = this.firstName;
    currentUser.lastName = this.lastName;
    currentUser.name = `${this.firstName} ${this.lastName}`;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  togglePassword(toggleName: string, elName: string) {
    this[toggleName] = !this[toggleName] ;
    console.log(this[elName]);
    // tslint:disable-next-line:max-line-length
    this[elName].nativeElement.type === 'password' ? this[elName].nativeElement.type = 'text' : this[elName].nativeElement.type = 'password';
  }

  inputPassword(f: NgForm) {
    this.passwordStrength = this.passwordService.checkPassStrength(f.value.password);
    console.log(this.passwordStrength);
  }
}
