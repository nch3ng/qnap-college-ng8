import { MetaService } from '@ngx-meta/core';
import { Component, OnInit, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit, AfterViewInit {

  @ViewChild('container', { static: false }) container: ElementRef;
  loaded = false;
  constructor(
    private readonly _meta: MetaService,
    private _renderer: Renderer2
  ) { }

  ngOnInit() {
    // this._meta.setTag('og:title', 'The page is under maintenance');

  }

  ngAfterViewInit() {
    // console.log(this.container)
    // this._renderer.setStyle(this.container.nativeElement, 'display', 'block');
  }

}
