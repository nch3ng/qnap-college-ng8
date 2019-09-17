import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { Observable } from 'rxjs';
import { ModalService } from '../../_services/modal.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  private sub: any;
  private routeSub: any;
  courses: Course [] = [];
  category: String = '';
  func: String;
  tag: string = '';

  gridCol: Number;
  gridClass: String;

  constructor(private _route: ActivatedRoute, private _courseService: CourseService, private _modalService: ModalService) {
    this.func = 'category';
    const localColSetting = localStorage.getItem('grid-col');
    this.gridCol = localColSetting ? + localColSetting : 2;
    this.gridCol === 2 ? this.gridClass = 'col-md-5' : this.gridClass = 'col-md-4';
  }

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
      this.category = params['name'];
      this.tag = params['tag_name'];
    });

   this.routeSub = this._route.data.subscribe(
    (data: Data) => {
      if (data.courses) {
        this.courses = data.courses;

        for (let course of this.courses) {
          this._courseService.getYoutubeInfo(course.youtube_ref).subscribe(
            (res_course: Course) => {
              course = res_course;
            }
          );
        }
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.routeSub .unsubscribe();
  }

  onGridSelect(grid: number) {
    this.gridCol = grid;
    localStorage.setItem('grid-col', this.gridCol.toString());
  }

  onModalPop(course: Course) {
    this._courseService.quickClicked(course);
    this._modalService.popModal(course.youtube_ref);
  }
}
