import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appSecurity]'
})
export class SecurityDirective implements OnInit {

  @Input('appSecurity')
  roles: string [];
  // tslint:disable-next-line: variable-name
  constructor(private el: ElementRef, private _renderer: Renderer2) {
  }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // console.log(currentUser);

    if (currentUser && this.roles.includes(currentUser.role.name)) {

    } else {
      const parentNode = this.el.nativeElement.parentNode;
      this.el.nativeElement.remove();
    }
  }
}
