import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CourseService } from '../../_services/course.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})

export class CommentsComponent implements OnInit, AfterViewInit, OnDestroy {
  app = 'Comments';
  sub: Subscription;
  page: 1;
  pages: 1;
  comments = [];
  total = 0;

  constructor(
    private _route: ActivatedRoute,
    private _courseService: CourseService
  ){}
  ngOnInit() {
    this.sub = this._route.data.subscribe(
      (data: Data) => {
        if (data.doc) {
          const doc = data.doc.payload;
          this.comments = doc.docs;
          
          for(const comment of this.comments) {
            setTimeout(() => {
              this._courseService.get(comment.course_id).subscribe(
                (course) => {
                  
                  comment.course = course;
                },
                (err) => {}
                
              );    
            }, 500);
            
          }
          this.page = doc.page;
          this.pages = doc.pages;
          this.total = doc.total;
        }
      });;
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onSearch(e) {
    console.log(e.target.value);
  }

  
}