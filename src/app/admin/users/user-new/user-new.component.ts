import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../auth/_models/user.model';
import { NgForm } from '@angular/forms';
import { ConfirmService } from '../../../_services/confirm.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../../auth/_services/users.service';

@Component({
  selector: 'app-user-new',
  templateUrl: '../shared/user-new.component.html',
  styleUrls: ['./user-new.component.scss']
})
export class UserNewComponent implements OnInit {

  app = 'Add User';
  user: User;
  constructor(
    private _confirmService: ConfirmService,
    private _toastr: ToastrService,
    private _usersService: UsersService,
    private _router: Router
  ) {
    this.user = new User();
  }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
    this._confirmService.open('Do you want to submit?').then(
      () => {
        this._usersService.create(this.user).subscribe(
        (res: any) => {
          this._toastr.success("Successfully create a user, a validation email has been sent");
          this._router.navigate(['/admin/users']);
        }, (err: any) => {
          console.log(err.error.message);
          this._toastr.success("Failed to add a user");
        });
      }).catch( () => {
        // Reject
        // this._toastr.error('Failed to add a user');
    });
  }

}
