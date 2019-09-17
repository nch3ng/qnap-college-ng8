import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { Injectable } from '@angular/core';
import { ModalService } from '../../_services/modal.service';

@Injectable()
export class SearchResolver implements Resolve<Course []> {
  constructor(private _courseService: CourseService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Course []> | Promise<Course []> | Course [] {
    // console.log('search resolver');
    return this._courseService.search(route.params.keywords);
  }

}
