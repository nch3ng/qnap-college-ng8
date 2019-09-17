import { AuthService } from './../../auth/_services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmService } from './../../_services/confirm.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../auth/_models/user.model';
import { UsersService } from '../../auth/_services/users.service';
import Role from '../../_models/role';
import { RoleService } from '../../_services/role.service';
import { EventBrokerService } from '../../_services/event.broker.service';
import { CommentsService } from '../../_services/comment.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  app = 'Users';
  sub: Subscription;
  doc: any;
  page = 1;
  pages = 1;
  total = 0;
  users: User [];
  roles: Role [];
  search = '';
  user_per_page = environment.user_per_page;
  @Output() loading: EventEmitter<any> = new EventEmitter();

  checkb = '<i class="fa fa-check"></i>';
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _confirmService: ConfirmService,
    private _toastr: ToastrService,
    private _usersService: UsersService,
    private _roleService: RoleService,
    private _eventBroker: EventBrokerService,
    private _authService: AuthService,
    private _commentsService: CommentsService) {
     }

  ngOnInit() {
    this.sub = this._route.data.subscribe(
      (data: Data) => {
        console.log(data)
        if (data.doc) {
          this.doc = data.doc;
          this.users = this.doc.docs;

          for (const user of this.users) {
            setTimeout(() => {
              this._commentsService.getCountOfCommentsByUserId(user._id).subscribe(
                (res) => {
                  user.commentCount = res.payload;
                },
                (err) => {}
              );
            }, 500)
          }
          this.page = this.doc.page;
          this.pages = this.doc.pages;
          this.total = this.doc.total;
        }
      });

    this._roleService.all().subscribe(
      (roles) => {
        this.roles = roles;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onDelete(user: User) {
    this._confirmService.open('Do you want to submit?').then(
      () => {
        this._usersService.delete(user._id).subscribe(
        (res: any) => {
          this._toastr.success("Successfully delete a user");
          this._router.navigate(['/admin/users']);
          this._usersService.all(this.page, this.user_per_page).subscribe(
            (res: any) => {
              this.users = res.docs;
            },
            (err) => {
              this._toastr.error("Failed to pull users data");
            }
          );
        }, (err: any) => {
          console.log(err.error.message);
          this._toastr.error("Failed to delete a user");
        });
      }).catch( () => {
        // Reject
        // this._toastr.error('Failed to add a user');
    });
  }

  onSetRole(uid: string, roleName: string) {
    this.loading.emit(null);
    this._eventBroker.emit<boolean>("loading", true);
    this._usersService.setRole(uid, roleName).subscribe(
      (res: any) => {
        this._usersService.all(this.page, this.user_per_page).subscribe(
          (res: any) => {
            console.log(res);
            this.users = res.docs;
            this._eventBroker.emit<boolean>("loading", false);
          },
          (err) => {
            this._toastr.error("Failed to pull users data");
            this._eventBroker.emit<boolean>("loading", false);
          }
        );
      },
      (err: any) => {
        console.log(err);
        this._eventBroker.emit<boolean>("loading", false);
      }
    );
  }

  onModelChange(e) {

    
  }

  onSendResetPassword(user: User) {
    this._confirmService.open(`Do you want to reset ${user.email}'s password?`).then(
      () => {
        this._authService.resetPasswordAdmin(user._id).subscribe(
          (res: any) => {
            if (res.success) {
              this._toastr.success(`User's reset password email has been sent`);
            }
          },
          (err: any) => {
            console.log(err);
          }
        );
      }
    ).catch( () => {
      // Reject
      // this._toastr.error('Failed to reset the password');
    });
    
  }


}
