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
    private authService: AuthService,
    private httpClient: HttpClient) {}

  create(user: User) {
    const body = JSON.stringify(user);
    const apiQuery = this.apiRoot + 'user';
    return this.httpClient.post<User []>(apiQuery, body, this.authService.jwtHttpClient());
  }

  delete(id: string) {
    const apiQuery = this.apiRoot + `user/${id}`;
    return this.httpClient.delete<User []>(apiQuery, this.authService.jwtHttpClient());
  }

  destroy() {
    const apiQuery = this.apiRoot + `user/destroy`;
    return this.httpClient.delete<User []>(apiQuery, this.authService.jwtHttpClient());
  }

  all(page?: number, limit?: number): Observable<User []> {
    let apiQuery = this.apiRoot + 'users?';
    if (page) {
      apiQuery += 'page=' + page + '&';
    }

    if (limit) {
      apiQuery += 'limit=' + limit;
    }
    return this.httpClient.get<User []>(apiQuery, this.authService.jwtHttpClient());
  }

  setRole(uid: string, roleName: string) {
    const apiQuery = this.apiRoot + `user/set_role/${uid}`;
    const body = JSON.stringify({role: roleName});
    return this.httpClient.put<User []>(apiQuery, body, this.authService.jwtHttpClient());
  }
  getAbbv(uid: string) {
    const apiQuery = this.apiRoot + `user/abvn/${uid}`;
    return this.httpClient.get<User []>(apiQuery, this.authService.jwtHttpClient());
  }

  updateName(firstName: string, lastName: string) {
    const apiQuery = this.apiRoot + `user/updateName`;
    const body = JSON.stringify({firstName, lastName});
    return this.httpClient.post<User []>(apiQuery, body, this.authService.jwtHttpClient());
  }
}
