import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import Role from '../_models/role';
import { AuthService } from '../auth/_services/auth.service';

@Injectable()
export class RoleService {

  apiRoot: string = environment.apiUrl;

  constructor(private httpClient: HttpClient, private _authService: AuthService) {}

  all(): Observable<Role []> {
    return this.httpClient.get<Role []>(this.apiRoot + 'roles', this._authService.jwtHttpClient())
      .pipe(
        catchError(this.handleError('getRoles', []))
      );
  }

 
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
