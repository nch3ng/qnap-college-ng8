import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Course } from '../../_models/course';
import { ActivatedRoute, Data } from '@angular/router';
import { SearchService } from '../../_services/search.service';
import { CourseService } from '../../_services/course.service';
import { ModalService } from '../../_services/modal.service';

@Component({
  selector: 'app-search',
  templateUrl: '../category/category.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private sub: any;
  private routeSub: any;
  // @Output() search: EventEmitter<any> = new EventEmitter();
  courses: Course [];
  func: string;
  gridCol: number;
  gridClass: string;
  category: string = null;
  tag: string = null;

  constructor(
    private _route: ActivatedRoute,
    private _searchService: SearchService,
    private _courseService: CourseService,
    private _modalService: ModalService) {
    this.func = 'search';
    this.courses = [];
    const localColSetting = localStorage.getItem('grid-col');
    this.gridCol = localColSetting ? + localColSetting : 2;
    this.gridCol === 2 ? this.gridClass = 'col-md-5' : this.gridClass = 'col-md-4';
  }

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
      // console.log('emit');
      this._searchService.emit(params['keywords']);
      // this.search.emit(params['keywords']);
    });

    this.routeSub = this._route.data.subscribe(
      (data: Data) => {
        // console.log(data);
        if (data.courses) {
          // console.log(data.courses);
          this.courses = data.courses;
          for (let course of this.courses) {
            this._courseService.getYoutubeInfo(course.youtube_ref).subscribe(
              (res_course: Course) => {
                course = res_course;
              }
            );
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.routeSub.unsubscribe();
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
