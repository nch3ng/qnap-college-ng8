import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AuthState } from 'src/app/auth/store/reducers';
import { getAuthUser } from 'src/app/auth/store/selects';
import { tap } from 'rxjs/operators';
import { noop } from 'rxjs';

@Directive({
  selector: '[appSecurity]'
})
export class SecurityDirective implements OnInit {

  @Input('appSecurity')
  roles: string [];
  // tslint:disable-next-line: variable-name
  constructor(private el: ElementRef, private _renderer: Renderer2, private store: Store<AuthState>) {
  }

  ngOnInit() {
    let currentUser;
    const user$ = this.store.pipe(
      select(getAuthUser),
      tap((user => {
        currentUser = user;
      }))
    ).subscribe(noop);

    // console.log(currentUser);
    //  = JSON.parse(localStorage.getItem('currentUser'));
    // console.log(currentUser);

    if (currentUser && this.roles.includes(currentUser.role.name)) {

    } else {
      const parentNode = this.el.nativeElement.parentNode;
      this.el.nativeElement.remove();
    }
  }
}
