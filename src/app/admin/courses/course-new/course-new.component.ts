import { CourseService } from './../../../_services/course.service';
import { ToastrService } from 'ngx-toastr';
import { Course } from './../../../_models/course';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from '../../../_models/category';
import { UcFirstPipe, SlugifyPipe } from 'ngx-pipes';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmService } from '../../../_services/confirm.service';

@Component({
  selector: 'app-course-new',
  templateUrl: '../shared/course-new.component.html',
  styleUrls: ['../shared/course-new.component.scss']
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

  courseForm;
  constructor(
    private route: ActivatedRoute,
    private ucfirstPipe: UcFirstPipe,
    private slugifyPipe: SlugifyPipe,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private courseService: CourseService,
    private router: Router) {
      this.course = new Course();
   }

  ngOnInit() {
    this.sub = this.route.data.subscribe(
      (data: Data) => {
        this.categories = data.categories;
        for (const category of this.categories) {
          category.name = this.ucfirstPipe.transform(category.name);
        }
      });

    this.courseForm = new FormGroup({
      code_name: new FormControl(this.course.code_name, [
        Validators.required])
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit(f: NgForm) {
    this.confirmService.open('Do you want to submit?').then(
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

        this.courseService.add(f.value).subscribe(
          (course: Course) => {
            this.toastr.success('Success');
            this.router.navigate(['/courses']);
        }, (error) => {
          this.toastr.error('Failed to add a course');
        });
      }).catch( () => {
        // Reject
        // this.toastr.error('Failed to add a course');
    });
  }
  onModelChange(value) {
    // console.log(this.slugifyPipe.transform(value));
    this.course.slug = this.slugifyPipe.transform(value);
  }
  // onTopicChange(value) {
  //   console.log(value);
  // }
}
