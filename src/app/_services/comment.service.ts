import { AuthService } from './../auth/_services/auth.service';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CommentsService {

  apiRoot: string = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService) {}

  post(courseId: string, comment: string, recaptchaToken?: string): Observable<any> {
    const body = JSON.stringify({
      course_id: courseId,
      comment,
      recaptchaToken
    });
    return this.httpClient.post<any>(this.apiRoot + 'comment', body, this.authService.jwtHttpClient())
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  delete(commentId: string): Observable<any> {
    return this.httpClient.delete<any>(this.apiRoot + 'comment/' + commentId, this.authService.jwtHttpClient())
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getCommentsByUserId(uid: string, limit?: number, page?: number): Observable<any> {
    let apiQuery = this.apiRoot + 'comments/user/' + uid + '?';
    if (limit) {
      apiQuery = apiQuery + '&limit=' + limit;
    }
    if (page) {
      apiQuery += '&page=' + page;
    } else {
      apiQuery += '&page=1';
    }
    return this.httpClient.get<any>(apiQuery, this.authService.jwtHttpClient())
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getCountOfCommentsByUserId(uid: string): Observable<any> {
    const apiQuery = this.apiRoot + 'comments/user/' + uid + '/count';
    return this.httpClient.get<any>(apiQuery, this.authService.jwtHttpClient())
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }
  searchCommentsOnUser(uid: string, query: string) {
    const apiQuery = this.apiRoot + 'comments/user/' + uid + '/search?query=' + query;
    return this.httpClient.get<any>(apiQuery, this.authService.jwtHttpClient())
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }
}
