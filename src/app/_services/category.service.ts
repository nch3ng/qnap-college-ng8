import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../_models/category';
import { environment } from '../../environments/environment';

@Injectable()
export class CategoryService {

  apiRoot: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  all(): Observable<Category []> {
    return this.httpClient.get<Category []>(this.apiRoot + 'categories')
      .pipe(
        catchError(this.handleError('getCategories', []))
      );
  }

  increase(category: string) {
    return this.httpClient
            .get(this.apiRoot + 'category/' + category + '/clicked')
            .subscribe(
              () => {},
              () => {}
            );

  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
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
