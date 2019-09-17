import { CourseService } from './../../_services/course.service';
import { Subscription } from 'rxjs';
import { Keyword } from './../../_models/keyword';
import { AuthService } from './../../auth/_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { KeywordService } from '../../_services/keyword.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  keywords: Keyword [];
  courseStats;
  start;
  end;
  app = 'dashboard';

  constructor(
    private _authService: AuthService,
    private _keywordService: KeywordService,
    private _courseService: CourseService
  ) {
    this._keywordService.all(10).subscribe(
      (keywords: Keyword []) => {
        this.keywords = keywords;
      }
    );

    // this._courseService.getClickStatus().subscribe(
    //   (courseStats) => {
    //     this.courseStats = courseStats;
    //     console.log(courseStats);
    //   },
    //   (err) => {
    //     console.log('Something went wrong!');
    //   }
    // );

  }

  ngOnInit() {
    console.log('nginit')
  }

  onSelected(event) {
    // console.log('selected');
    this._courseService.getClickStatus(event.start, event.end).subscribe(
      (courseStats) => {
        this.courseStats = courseStats;
        // console.log(courseStats);
      },
      (err) => {
        console.log('Something went wrong!');
      }
    );
    // console.log(event);
    this._courseService.getClickStatus(event.start, event.end).subscribe(
      (courseStats) => {
        this.courseStats = courseStats;
        console.log(courseStats);
      },
      (err) => {
        console.log('Something went wrong!');
      }
    );
  }
}
