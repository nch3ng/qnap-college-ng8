import { CourseService } from './../../../_services/course.service';
import { ToastrService } from 'ngx-toastr';
import { Course } from './../../../_models/course';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from '../../../_models/category';
import { UcFirstPipe, SlugifyPipe } from 'ngx-pipes';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ConfirmService } from '../../../_services/confirm.service';

@Component({
  selector: 'app-course-new',
  templateUrl: '../shared/course-new.component.html',
  styleUrls: ['./course-new.component.scss']
})
export class CourseNewComponent implements OnInit, OnDestroy {

  app = 'add course';
  func = 'new';
  sub: Subscription;
  categories: Category [] = [];
  tags: string [] = [];
  course: Course;
  returnUrl: string = null;
  courseDate: NgbDateStruct;
  public options = {
    placeholder: ''
};
  constructor(
    private _route: ActivatedRoute,
    private _ucfirstPipe: UcFirstPipe,
    private _slugifyPipe: SlugifyPipe,
    private _confirmService: ConfirmService,
    private _toastr: ToastrService,
    private _courseService: CourseService,
    private _router: Router) {
      this.course = new Course();
   }

  ngOnInit() {
    this.sub = this._route.data.subscribe(
      (data: Data) => {
        this.categories = data.categories;
        for (const category of this.categories) {
          category.name = this._ucfirstPipe.transform(category.name);
        }
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit(f: NgForm) {
    this._confirmService.open('Do you want to submit?').then(
      () => {
        const tags = f.value.tags;
        f.value.tags = [];
        f.value.keywords = '';
        for ( const tag of tags) {
          if ( typeof tag === 'string') {
            f.value.tags.push(tag);
          } else if (typeof tag === 'object' && tag['value']) {
            f.value.tags.push(tag['value']);
          }
          f.value.keywords === '' ? f.value.keywords += tag.value : f.value.keywords = f.value.keywords + ',' + tag.value;
        }

        // console.log(f.value);

        this._courseService.add(f.value).subscribe(
          (course: Course) => {
            this._toastr.success('Success');
            this._router.navigate(['/courses']);
        }, (error) => {
          this._toastr.error('Failed to add a course');
        });
      }).catch( () => {
        // Reject
        // this._toastr.error('Failed to add a course');
    });
  }
  onModelChange(value) {
    // console.log(this._slugifyPipe.transform(value));
    this.course.slug = this._slugifyPipe.transform(value);
  }
  // onTopicChange(value) {
  //   console.log(value);
  // }
}
