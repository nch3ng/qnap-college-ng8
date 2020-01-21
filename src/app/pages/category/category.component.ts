import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { Observable } from 'rxjs';
import { ModalService } from '../../_services/modal.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  private sub: any;
  private routeSub: any;
  courses: Course [] = [];
  category = '';
  func: string;
  tag = '';

  gridCol: number;
  gridClass: string;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private modalService: ModalService,
    @Inject(PLATFORM_ID) private platformId: object) {
    this.func = 'category';
    let localColSetting = null;
    if (isPlatformBrowser(this.platformId)) {
      localColSetting = localStorage.getItem('grid-col');
    }
    this.gridCol = localColSetting ? +localColSetting : 2;
    this.gridCol === 2 ? this.gridClass = 'col-md-5' : this.gridClass = 'col-md-4';
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.category = params['name'];
      this.tag = params['tag_name'];
    });

   this.routeSub = this.route.data.subscribe(
    (data: Data) => {
      if (data.courses) {
        this.courses = data.courses;

        for (let course of this.courses) {
          this.courseService.getYoutubeInfo(course.youtube_ref).subscribe(
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
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('grid-col', this.gridCol.toString());
    }
  }

  onModalPop(course: Course) {
    this.courseService.quickClicked(course);
    this.modalService.popModal(course.youtube_ref);
  }
}
