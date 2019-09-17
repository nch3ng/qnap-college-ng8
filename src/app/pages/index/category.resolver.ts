import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Category } from '../../_models/category';
import { CategoryService } from '../../_services/category.service';

@Injectable()
export class CategoryResolver implements Resolve<Category []> {
  constructor(private _categoryeService: CategoryService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Category []> | Promise<Category []> | Category [] {
    return this._categoryeService.all();
  }
}
