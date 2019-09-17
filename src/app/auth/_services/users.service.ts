import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user.model';

@Injectable()
export class UsersService {

  apiRoot: string = environment.apiUrl;

  constructor(
    private _authService: AuthService,
    private _httpClient: HttpClient) {}

  create(user: User) {
    const body = JSON.stringify(user);
    const api_query = this.apiRoot + 'user';
    return this._httpClient.post<User []>(api_query, body, this._authService.jwtHttpClient());
  }

  delete(id: string) {
    const api_query = this.apiRoot + `user/${id}`;
    return this._httpClient.delete<User []>(api_query, this._authService.jwtHttpClient());
  }

  destroy() {
    const api_query = this.apiRoot + `user/destroy`;
    return this._httpClient.delete<User []>(api_query, this._authService.jwtHttpClient());
  }

  all(page?: number, limit?: number): Observable<User []> {
    let api_query = this.apiRoot + 'users?';
    if (page) {
      api_query += 'page=' + page + '&';
    }

    if (limit) {
      api_query += 'limit=' + limit;
    }
    return this._httpClient.get<User []>(api_query, this._authService.jwtHttpClient());
  }

  setRole(uid: string, roleName: string) {
    const api_query = this.apiRoot + `user/set_role/${uid}`;
    const body = JSON.stringify({role: roleName});
    return this._httpClient.put<User []>(api_query, body,this._authService.jwtHttpClient());
  }
  getAbbv(uid: string) {
    const api_query = this.apiRoot + `user/abvn/${uid}`;
    return this._httpClient.get<User []>(api_query, this._authService.jwtHttpClient());
  }

  updateName(firstName: string, lastName: string) {
    const api_query = this.apiRoot + `user/updateName`;
    const body = JSON.stringify({firstName:firstName, lastName: lastName})
    return this._httpClient.post<User []>(api_query, body, this._authService.jwtHttpClient());
  }
}
