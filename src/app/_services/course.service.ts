import { Comment } from './../_models/comment';
import { CourseDoc } from './../_models/document';
import { AuthService } from './../auth/_services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../_models/course';
import { environment } from '../../environments/environment';

@Injectable()
export class CourseService {
  apiRoot: string = environment.apiUrl;
  public options;
  public optionsMapping;
  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.options = [
      { name: 'Latest', value: 'publishedDate'},
      { name: 'Most Viewed', value: 'watched'},
      { name: 'Most Liked', value: 'like'}
    ];

    this.optionsMapping = {
      // tslint:disable-next-line:object-literal-key-quotes
      'Latest': 'publishedDate',
      'Most Viewed': 'watched',
      'Most Liked' : 'like',
      'My Favorite': 'favorites'
    };
  }
  all(limit?: number, getBy?: string, page?: number): Observable<CourseDoc> {
    const apiQuery = this.constructParams(limit, getBy, page);
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    // console.log(apiQuery);
    return this.httpClient.get<CourseDoc>(apiQuery, {headers});
  }

  getFavoritedCourses(limit: number = 6, page: number = 1): Observable<CourseDoc> {
    let apiQuery = '';
    apiQuery = this.apiRoot + 'courses/favorites?page=' + page;
    // const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this.httpClient.get<CourseDoc>(apiQuery, this.authService.jwtHttpClient());
  }

  constructParams(limit?: number, getBy?: string,  page?: number, ifItsFavorite: boolean = false): string {
    let by = 'publishedDate';
    let apiQuery = this.apiRoot + 'courses?orderBy=';
    if (getBy) {
      by = getBy;
    }
    apiQuery = apiQuery + by + ':desc';
    if (limit) {
      apiQuery = apiQuery + '&limit=' + limit;
    }
    if (page) {
      apiQuery += '&page=' + page;
    } else {
      apiQuery += '&page=1';
    }

    return apiQuery;
  }

  add(course: Course) {
    const apiQuery = this.apiRoot + 'courses';
    return this.httpClient.post(apiQuery, course, this.authService.jwtHttpClient());
  }

  update(course: Course) {
    const apiQuery = this.apiRoot + 'courses';
    return this.httpClient.put(apiQuery, course, this.authService.jwtHttpClient());
  }

  allByCategory(category: string, orderBy?: string): Observable<Course []> {
    const apiQuery = this.apiRoot + 'category/' + category + '/courses';
    if (orderBy) {
    }
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this.httpClient.get<Course []>(apiQuery, {headers});
  }

  allByTag(tag: string, orderBy?: string): Observable<Course []> {
    const apiQuery = this.apiRoot + 'tag/'  + tag;
    if (orderBy) {
    }
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache')  ;
    return this.httpClient.get<Course []>(apiQuery, {headers});
  }

  allCommentsByCourseId(courseId: string): Observable<Comment []>  {
    const apiQuery = this.apiRoot + 'comments/course/'  + courseId;
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this.httpClient.get<Comment []>(apiQuery, {headers});
  }

  get(id: any): Observable<Course> {
    const apiQuery = this.apiRoot + 'courses/' + id;
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this.httpClient.get<Course>(apiQuery, {headers});
  }

  get_by_slug(slug: string): Observable<Course> {
    const apiQuery = this.apiRoot + 'courses/s/' + slug;
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this.httpClient.get<Course>(apiQuery, {headers});
  }

  getYoutubeInfo(youtubeRef: string): Observable<Course> {
    const apiQuery = this.apiRoot + 'courses/' + youtubeRef + '/youtubeinfo';
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this.httpClient.get<Course>(apiQuery, {headers});
  }

  search(query: string): Observable<Course []> {
    if (!query) {
      query = '';
    }
    // console.log('search');
    const apiQuery = this.apiRoot + 'courses/search?query=' + query;
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this.httpClient.get<Course []>(apiQuery, {headers});
  }

  delete(id: string): Observable<any> {
    const apiQuery = this.apiRoot + 'courses/' + id;
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');
    return this.httpClient.delete<any>(apiQuery, this.authService.jwtHttpClient());
  }

  clicked(id: string): Observable<any> {
    const apiQuery = this.apiRoot + 'courses/' + id + '/clicked';
    return this.httpClient.post<any>(apiQuery, '');
  }

  quickClicked(course) {
    this.clicked(course._id).subscribe(
      () => {},
      (err) => {
      }
    );
  }

  getClickStatus(start?: string, end?: string) {
    let apiQuery = this.apiRoot + 'courses/clickStatus';
    let params = '';

    if (start || end) {
      params += '?';

      if (start) {
        params += 'startDate=' + start + '&';
      }

      if (end) {
        params += 'endDate=' + end;
      }
      apiQuery += params;
    }
    return this.httpClient.get<any>(apiQuery, this.authService.jwtHttpClient());
  }
}
