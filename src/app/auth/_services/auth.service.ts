
import { of,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { AuthResponse, AuthResponseError } from './../../_models/authresponse';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService as SocialService } from 'angularx-social-login';
import * as ResCode from '../../_codes/response';
import { User } from '../_models/user.model';

@Injectable()
export class AuthService {
  private apiRoot = environment.apiUrl;
  token: string;
  // tslint:disable-next-line: variable-name
  private _loggedIn;
  constructor(private httpClient: HttpClient, private socialService: SocialService) {
    this._loggedIn = false;
  }

  private updating = false;

  constructHeader() {
    const currUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = ( currUser && 'token' in currUser) ? currUser.token : this.token;
    const headers = new Headers({ 'x-access-token': token });
    return { headers };
  }

  fbLogin(fbPayload: any) {
    const body = JSON.stringify(fbPayload);
    // console.log(body);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const options = {
      headers
    };
    return this.httpClient.post<AuthResponse>(`${this.apiRoot}fbLogin`, body, options).pipe(
      map((response: any) => {
        // console.log("[fbLogin]: ", response);
        if (response.success === true) {
          if (response.payload.code === ResCode.PASSWORD_HAS_NOT_BEEN_CREATED) {
            return response.payload;
          } else {
            const ruser = response.payload;
            ruser.token = response.token;
            // tslint:disable-next-line:no-string-literal
            delete ruser['salt'];
            // tslint:disable-next-line:no-string-literal
            delete ruser['hash'];
            if (ruser && ruser.token) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(ruser));
            }
            return ruser;
          }
        }
      }));
  }

  googleLogin(googlePayload: any) {
    const body = JSON.stringify(googlePayload);
    // console.log(body);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const options = {
      headers
    };
    return this.httpClient.post<AuthResponse>(`${this.apiRoot}googleLogin`, body, options).pipe(
      map((response: any) => {
        // console.log("[googleLogin]: ", response);
        if (response.success === true) {
          if (response.payload.code === ResCode.PASSWORD_HAS_NOT_BEEN_CREATED) {
            return response.payload;
          } else {
            const ruser = response.payload;
            ruser.token = response.token;
            // tslint:disable-next-line:no-string-literal
            delete ruser['salt'];
            // tslint:disable-next-line:no-string-literal
            delete ruser['hash'];
            if (ruser && ruser.token) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(ruser));
            }
            return ruser;
          }
        }
      }));
  }

  login(email: string, password: string, recaptchaToken?: string): any {
    const body = JSON.stringify({ email, password, recaptchaToken });
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const options = {
      headers
    };

    return this.httpClient.post<AuthResponse>(`${this.apiRoot}login`, body, options).pipe(
      map((response: AuthResponse) => {
        // console.log(response);
        // login successful if there's a jwt token in the response
        if (response.success === true) {
          const user = response.payload;
          // console.log(user)
          user.token = response.token;
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // tslint:disable-next-line:no-string-literal
            delete user['salt'];
            // tslint:disable-next-line:no-string-literal
            delete user['hash'];
            this._loggedIn = true;
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return user;
        }
      }));
  }

  register(email: string, password: string, firstName: string, lastName: string): any {
    const body = JSON.stringify({ email, password, firstName, lastName });
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const options = {
      headers
    };
    return this.httpClient.post<AuthResponse>(`${this.apiRoot}register`, body, options).pipe(
    map((response: AuthResponse) => {
      // login successful if there's a jwt token in the response
      if (response.success === true) {
        const user = response.payload;
        user.token = response.token;
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          // tslint:disable-next-line:no-string-literal
          delete user['salt'];
          // tslint:disable-next-line:no-string-literal
          delete user['hash'];
          this._loggedIn = true;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return user;
      } else {
        throw new Error(response.message);
      }
    }));
  }

  logout() {
    // remove user from local storage to log user out
    this.token = null;
    this._loggedIn = false;
    this.socialService.signOut();
    localStorage.removeItem('currentUser');
  }

  verify(): Observable<AuthResponse | AuthResponseError> {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get<AuthResponse | AuthResponseError>(this.apiRoot + 'check-state', this.jwtHttpClient()).pipe(catchError((err) => {
      // console.error('An error occurred:', err.error);
      return of(err);
    }));
  }
  tmpVerify(token): Observable<AuthResponse | AuthResponseError> {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get<AuthResponse | AuthResponseError>(this.apiRoot + 'check-tmp-state?token=' + token, this.jwtHttpClient()).pipe(catchError((err: HttpErrorResponse) => {
      // console.error('An error occurred:', err.error);
      return of(err.error);
    }));
  }

  changePassword(email: string, oldPassword: string, password: string): Observable<AuthResponse | AuthResponseError> {
    const body = JSON.stringify({ email, password, oldPassword });
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post<AuthResponse | AuthResponseError>(this.apiRoot + 'change-password', body, this.jwtHttpClient()).pipe(catchError((err: HttpErrorResponse) => {
      console.error('An error occurred:', err.error);
      return of(err.error);
    }));
  }

  resetPasswordAdmin(id: string): Observable<AuthResponse | AuthResponseError> {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post<AuthResponse | AuthResponseError>(this.apiRoot + 'reset-password-admin/' + id, null, this.jwtHttpClient()).pipe(catchError((err: HttpErrorResponse) => {
      console.error('An error occurred:', err.error);
      return of(err.error);
    }));
  }


  setToken(res) {
    // tslint:disable-next-line:no-string-literal
    const body = JSON.parse(res['_body']);
    // tslint:disable-next-line:no-string-literal
    if (body['success'] === true) {
      // tslint:disable-next-line:no-string-literal
      this.token = body['token'];
      this._loggedIn = true;
      localStorage.setItem('currentUser', JSON.stringify({
        // tslint:disable-next-line:no-string-literal
        email: body['user']['email'],
        token: this.token
      }));
    }
    return body;
  }

  parseRes(res) {
    // tslint:disable-next-line:no-string-literal
    const body = JSON.parse(res['_body']);
    return body;
  }

  get loggedIn() {
    return this._loggedIn;
  }

  set loggedIn(value: boolean) {
    this._loggedIn = value;
  }

  verifyEmail(uid: string, token: string, ifReset?: boolean): Observable<{success: boolean, message: string}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const reset = ifReset ? '&reset=1' : '&reset=0';
    // tslint:disable-next-line: max-line-length
    return this.httpClient.post<{success: boolean, message: string}>(`${this.apiRoot}user/verification/${uid}?token=${token}${reset}`, {}, { headers });
  }

  resendVerification(uid: string): Observable<{success: boolean, message: string}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post<{success: boolean, message: string}>(`${this.apiRoot}user/resend_verification/${uid}`, {}, { headers });
  }

  createPassword(uid: string, token: string, password: string): Observable<{success: boolean, message: string}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({password});
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post<{success: boolean, message: string}>(`${this.apiRoot}user/create_password/${uid}?token=${token}`, body, { headers });
  }

  prepareForgetPassword(seed: string): Observable<{success: boolean, message: string, payload: object}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get<{success: boolean, message: string, payload: object}>(`${this.apiRoot}forget-password/${seed}`, { headers });
  }

  postForgetPassword(tuid: string, token: string, email: string): Observable<{success: boolean, message: string, payload: object}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({token, email});
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post<{success: boolean, message: string, payload: object}>(`${this.apiRoot}forget-password/${tuid}`, body, { headers });
  }


  jwtHttpClient() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // console.log(currentUser);
    if (currentUser && currentUser.token) {
      let headers = new HttpHeaders({ 'x-access-token': currentUser.token });
      headers = headers.append('Content-Type', 'application/json');
      return { headers };
    }
  }

  jwtHttpClientHeader(): HttpHeaders {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let headers;
    if (currentUser && currentUser.token) {
      headers = new HttpHeaders({ 'x-access-token': currentUser.token });
      return headers;
    }
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  updateCurrentUser(currentUser: User) {
    if (this.updating === false) {
      this.updating = true;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      this.updating = false;
    } else {
      console.error('You cannot updating the data - race condition');
    }
  }

}
