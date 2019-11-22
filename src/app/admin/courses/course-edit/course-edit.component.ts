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
    private route: ActivatedRoute,
    private ucfirstPipe: UcFirstPipe,
    private confirmService: ConfirmService,
    private courseService: CourseService,
    private toastr: ToastrService,
    private slugify: SlugifyPipe,
    private router: Router ) {

    this.paramSub = this.route.params.subscribe(
      (params) => {
        // this.returnUrl = params['returnUrl'];
        console.log(params);
      }
    );
    this.queryParamSub = this.route.queryParams.subscribe(
      (params) => {
        // tslint:disable-next-line:no-string-literal
        this.returnUrl = params['returnUrl'];

        console.log(params);
      }
    );

    this.dataSub = this.route.data.subscribe(
      (data: Data) => {
        // console.log(data);
        this.course = data.course;
        this.course.tags = new Array();
        // tslint:disable-next-line:no-string-literal
        if (this.course['keywords']) {
          // tslint:disable-next-line:no-string-literal
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
    this.confirmService.open('Do you want to submit?').then(
      () => {
        const tags = f.value.tags;
        f.value.tags = [];
        f.value.keywords = '';
        for ( const tag of tags) {
          let tagname;
          if ( typeof tag === 'string') {
            f.value.tags.push(tag);
            tagname = tag;
          // tslint:disable-next-line:no-string-literal
          } else if (typeof tag === 'object' && tag['value']) {
            // tslint:disable-next-line:no-string-literal
            f.value.tags.push(tag['value']);
            // tslint:disable-next-line:no-string-literal
            tagname = tag['value'];
          }
          f.value.keywords === '' ? f.value.keywords += tagname : f.value.keywords = f.value.keywords + ',' + tagname;
        }
        // tslint:disable-next-line:no-string-literal
        f.value['_id'] = this.course._id;
        f.value.category = this.slugify.transform(f.value.category);
        this.courseService.update(f.value).subscribe(
          (course: Course) => {
            this.toastr.success('Success');
            if (this.returnUrl) {
              this.router.navigate([this.returnUrl]);
            } else {
              this.router.navigate(['/courses']);
            }
        }, (error) => {
          this.toastr.error('Failed to add a course');
        });
      }).catch( () => {
        // Reject
        // this.toastr.error('Failed to add a course');
    });
  }

  onModelChange(e) {}
  // onTopicChange(value) {
  //   console.log(value);
  // }
}
