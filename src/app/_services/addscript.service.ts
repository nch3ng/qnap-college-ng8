import { Injectable } from '@angular/core';
import { Observable ,  Subscriber } from 'rxjs';

@Injectable()
export class AddScriptService {
  constructor() {}

  checkForScript(scriptPath: string) {
    let scriptOnPage = false;
    const selector = `script[src*="${scriptPath}"]`;
    const matches = document.querySelectorAll(selector);
    if (matches.length > 0) {
        scriptOnPage = true;
    }
    return scriptOnPage;
  }

  addScript(scriptPath: string, params?: object, onload?: any, force: boolean = false) {
    // console.log(scriptPath);
    // if script is already on page, do nothing
    if (!force && this.checkForScript(scriptPath)) {
      // console.log('existed');
      return;
    }

    const scriptInFooter = true;

    let allParams = '?'
    if (params) {
      for (let key in params) {
        // console.log(params[key]);
        allParams = `${allParams}&${key}=${params[key]}`;
      }

      scriptPath = scriptPath + allParams;
    }

    // console.log(scriptPath);
    const script = document.createElement('script');
    script.src = scriptPath;
    script.onload = onload;
    // append SCRIPT element

    if (scriptInFooter !== true && typeof document.head === 'object') {
      document.head.appendChild(script);
    } else {
      document.body.appendChild(script);
    }
  }

  addMeta(params: object) {
    // console.log('add Meta')
    let meta = document.createElement('meta');

    for (let key in params) {
      // console.log(key);
      meta['key'] = params[key];
    }
    document.head.appendChild(meta);
  }
}
