import { CourseDoc } from './../../_models/document';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course } from './../../_models/course';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ConfirmService } from '../../_services/confirm.service';
import { CourseService } from '../../_services/course.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CoursesComponent implements OnInit, OnDestroy {

  app = 'Courses';
  courses: Course [] = [];
  sub: Subscription;
  page: number = 1;
  pages: number = 1;
  search: string = '';

  constructor(
    private _route: ActivatedRoute,
    private _confirmService: ConfirmService,
    private _courseService: CourseService,
    private _toastr: ToastrService) { }

  ngOnInit() {
    this.sub = this._route.data.subscribe(
      (data: Data) => {
        // console.log(data);
        if (data.coursedoc) {
          this.courses = data.coursedoc.docs;
          this.page = data.coursedoc.page;
          this.pages = data.coursedoc.pages;

          for (const course of this.courses) {
            course['tags'] = [];
            if (course['keywords']) {
              course['tags'] = course['keywords'].split(',');
            }
            // console.log(course['tags']);
          }
        }
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onDelete(course: Course) {
    this._confirmService.open('Do you want to delete?').then(
      () => {
        // console.log('ok');
        // console.log(course);
        this._courseService.delete(course._id).subscribe(
          (res_course) => {
            this._toastr.success('Success');
            this._courseService.all().subscribe(
              (coursedoc: CourseDoc) => {
                this.courses = coursedoc.docs;
              },
              (error) => {
                this._toastr.error(error.message);
              }
            );
          },
          (error) => {
            console.log(error)
            this._toastr.error(error.error.message);
          }
        );
      }).catch( (error) => {
        // this._toastr.error(error.message);
        // Reject
        // console.log('no');
      });
  }

  onModelChange(e) {
    this._courseService.search(e).subscribe(
      (courses) => {
        this.courses = courses;
      },
      (err) => {
        this._toastr.error('something went wrong.');
      }
    );
  }

}
