
import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as ResponseCode from '../../../_codes/response';
import { AuthService } from '../../_services/auth.service';
import { ConfirmService } from '../../../_services/confirm.service';

@Component({
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.scss']
})

export class VerificationFailedComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() message: any;
  @Input() type: number;
  @Input() payload: any;
  statement: string;
  token_in_valid: boolean;

  constructor(private _authService: AuthService, private _confirmService: ConfirmService){}
  
  ngOnInit() {
    this.statement = '';
  }

  ngAfterViewInit() {

    if (this.type === ResponseCode.USER_NOT_FOUND) {
      this.statement = 'The user does not exist, please contact site administrator';
    } else if (this.type === ResponseCode.TOKEN_IS_INVALID) {
      this.statement = 'Token is invalid';
      this.token_in_valid = true;
    }

  }

  ngOnDestroy() {  
  }

  resend() {

    this._authService.resendVerification(this.payload.uid).subscribe(
      (res) => {
        this._confirmService.alert("Success!");
      },
      (err) => {}
    );
  }
}
