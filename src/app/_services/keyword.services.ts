import { AuthService } from './../auth/_services/auth.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Keyword } from '../_models/keyword';
import { environment } from '../../environments/environment';

@Injectable()
export class KeywordService {

  apiRoot: string = environment.apiUrl;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  all(limit?: number): Observable<Keyword []> {
    let limitStr = '';
    if (limit) {
      limitStr = '?limit=' + limit;
    }
    const apiQuery = this.apiRoot + 'keywords' + limitStr;

    return this.httpClient.get<Keyword []>(apiQuery, this.authService.jwtHttpClient());
  }
}
