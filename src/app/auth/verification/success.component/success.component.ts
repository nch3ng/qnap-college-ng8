
import { Component, Input, OnInit } from '@angular/core';
import * as ResCode from '../../../_codes/response';
import { Router } from '@angular/router';

@Component({
  templateUrl: './success.component.html'
  // styleUrls: ['./success.component.scss']
})

export class VerificationSuccessComponent implements OnInit {
  @Input() type: number;
  @Input() payload: any;

  constructor(private _router: Router) {}
  ngOnInit() {
    switch (this.type) {
      case ResCode.PASSWORD_HAS_NOT_BEEN_CREATED:
        this._router.navigate(['/user/create-password', this.payload.uid], { queryParams: { token:  this.payload.token} });
        break;
      case ResCode.GENERAL_SUCCESS:
        break;
      default:
        break;
    }
  }
}
