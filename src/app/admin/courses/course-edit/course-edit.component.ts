import { ToastrService } from 'ngx-toastr';
import { CourseService } from './../../../_services/course.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from '../../../_models/course';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Category } from '../../../_models/category';
import { Subscription } from 'rxjs';
import { UcFirstPipe, SlugifyPipe } from 'ngx-pipes';
import { NgForm } from '@angular/forms';
import { ConfirmService } from '../../../_services/confirm.service';

@Component({
  selector: 'app-course-edit',
  templateUrl: '../shared/course-new.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit, OnDestroy {

  app = 'edit course';
  func = 'edit';
  paramSub: Subscription;
  queryParamSub: Subscription;
  dataSub: Subscription;
  course: Course;
  categories: Category [];
  returnUrl: string = null;
  constructor(
    private _route: ActivatedRoute,
    private ucfirstPipe: UcFirstPipe,
    private _confirmService: ConfirmService,
    private _courseService: CourseService,
    private _toastr: ToastrService,
    private _slugify: SlugifyPipe,
    private _router: Router ) {
    this.paramSub = this._route.params.subscribe(
      (params) => {
        // this.returnUrl = params['returnUrl'];

        console.log(params);
      }
    );
    this.queryParamSub = this._route.queryParams.subscribe(
      (params) => {
        this.returnUrl = params['returnUrl'];

        console.log(params);
      }
    );

    this.dataSub = this._route.data.subscribe(
      (data: Data) => {
        // console.log(data);
        this.course = data.course;
        this.course.tags = new Array();
        if (this.course['keywords']) {
          this.course.tags = this.course['keywords'].split(',');
        }

        setTimeout( () => {
          this.categories = data.categories;

          for (const category of this.categories) {
            category.name = this.ucfirstPipe.transform(category.name);
          }
        }, 0);
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
    this.dataSub.unsubscribe();
    this.queryParamSub.unsubscribe();
  }

  onSubmit(f: NgForm) {
    // console.log('onSubmit: edit');
    // console.log(f.value);
    this._confirmService.open('Do you want to submit?').then(
      () => {
        const tags = f.value.tags;
        f.value.tags = [];
        f.value.keywords = '';
        for ( const tag of tags) {
          let tagname;
          if ( typeof tag === 'string') {
            f.value.tags.push(tag);
            tagname = tag;
          } else if (typeof tag === 'object' && tag['value']) {
            f.value.tags.push(tag['value']);
            tagname = tag['value'];
          }
          f.value.keywords === '' ? f.value.keywords += tagname : f.value.keywords = f.value.keywords + ',' + tagname;
        }
        f.value['_id'] = this.course._id;
        f.value.category = this._slugify.transform(f.value.category);
        this._courseService.update(f.value).subscribe(
          (course: Course) => {
            this._toastr.success('Success');
            if (this.returnUrl) {
              this._router.navigate([this.returnUrl]);
            } else { 
              this._router.navigate(['/courses']);
            }
            
        }, (error) => {
          this._toastr.error('Failed to add a course');
        });
      }).catch( () => {
        // Reject
        // this._toastr.error('Failed to add a course');
    });
  }

  onModelChange(e) {}
  // onTopicChange(value) {
  //   console.log(value);
  // }
}
