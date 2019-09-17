import { Renderer2, Injectable, Inject, RendererFactory2, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class NgxScreensizeService {
  private renderer: Renderer2;

  sizeStyle = 'md';
  x = 0;
  y = 0;

  config = {
    breakPoints: {
      xs: { max: 767 },
      sm: { min: 768, max: 991 },
      md: { min: 992, max: 1199 },
      lg: { min: 1200, max: 1599 },
      xl: { min: 1600 }
    }
  };

  sortable_array = [];

  constructor(rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) {
    this.renderer = rendererFactory.createRenderer(null, null);

    // Sort config
    for (const key in this.config.breakPoints) {
      if (this.config.breakPoints.hasOwnProperty(key)) {

        if (!this.config.breakPoints[key]['min']) {
          this.config.breakPoints[key]['min'] = 0;
        }
        this.sortable_array.push([key, this.config.breakPoints[key]['min']]);
      }
    }

    this.sortable_array.sort(
      (a, b) => {
        return a[1] - b[1];
      });
    // End sorting
    document.addEventListener('DOMContentLoaded', () => {
      this.sizeClass();
    });

    window.addEventListener('orientationchange', (event) => {
      setTimeout( () => {
        this.sizeClass();
      }, 100);
    });
  }

  refreshSize() {
    this.x = document.documentElement.clientWidth;
    this.y = document.documentElement.clientHeight;
  }

  getScreensize() {
    return { x: this.x, y: this.y };
  }

  sizeClass(): string {
    this.x = document.documentElement.clientWidth;
    this.y = document.documentElement.clientHeight;
    for (const size of this.sortable_array) {
      if (this.x < +size[1]) {
        // console.log(this.x + ' ' + size[1]);
        break;
      }
      this.sizeStyle = size[0];
      // console.log(this.sizeStyle);
    }
    this.removeAllClass();
    this.renderer.addClass(this.document.body, this.sizeStyle);
    return this.sizeStyle;
  }

  removeAllClass() {
    this.renderer.removeClass(this.document.body, 'xs');
    this.renderer.removeClass(this.document.body, 'sm');
    this.renderer.removeClass(this.document.body, 'md');
    this.renderer.removeClass(this.document.body, 'lg');
    this.renderer.removeClass(this.document.body, 'xl');
  }
}
