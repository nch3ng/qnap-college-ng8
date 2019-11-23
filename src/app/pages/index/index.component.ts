import { MetaService } from '@ngx-meta/core';
import { CourseDoc } from './../../_models/document';
import { ModalService } from './../../_services/modal.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Category } from '../../_models/category';
import { CategoryService } from '../../_services/category.service';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Course } from '../../_models/course';
import { NgxScreensizeService } from '../../modules/ngx-screensize/_services/ngx-screensize.service';
import { CourseService } from '../../_services/course.service';

import * as _ from 'lodash';
import { AuthService } from '../../auth/_services/auth.service';
import { FavService } from '../../_services/favorite.service';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { setCurrentDisplay } from 'src/app/store/preference/actions';
import { getCurrentDisplay } from 'src/app/store/preference/selects';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('cElement', { static: false }) cElement: ElementRef;
  @ViewChild('collection', { static: false }) collectionEl: ElementRef;
  private sub: any;
  categories: Category [];
  courses: Course [];
  cGridWidth: number;
  gridCol: number;
  gridClass: string;
  toCollection: boolean;
  menuOpen: boolean;
  menuOpenForStyle: boolean;
  displayOptions;
  currentDisplay;
  loading;
  cs;
  page = 1;
  loadingmore = false;
  totalPages = 0;
  finished = false;
  loggedIn = false;
  currentUser = null;
  currentUserAbbvName = 'JD';

  @HostListener('window:scroll', ['$event'])
  currentPosition() {
    if (window.pageYOffset + 300 > this.collectionEl.nativeElement.offsetHeight) {
      this.toCollection = false;  // set true if wanna enable the collection button.
    } else {
      this.toCollection = false;
    }
  }

  constructor(
    private categoryService: CategoryService,
    private favService: FavService,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private ssService: NgxScreensizeService,
    private courseService: CourseService,
    private router: Router,
    private authService: AuthService,
    private store: Store<AppState>) {
    }

  ngOnInit() {
    const localColSetting = localStorage.getItem('grid-col');
    this.cGridWidth = 0;
    this.categories = [];
    this.courses = [];
    this.gridCol = localColSetting ? + localColSetting : 2;
    this.gridCol === 2 ? this.gridClass = 'col-md-5' : this.gridClass = 'col-md-4';
    this.menuOpen = false;
    this.menuOpenForStyle = false;
    this.displayOptions = this.courseService.options;
    this.loading = false;

    this.store.pipe(
      select(getCurrentDisplay)
    ).subscribe(currentDisplay => {
      this.currentDisplay = currentDisplay;
    });

    if (this.currentDisplay) {
      this.cs = this.courseService.optionsMapping[this.currentDisplay];
    }

    this.authService.verify().subscribe(
      (res) => {
        if (res && res.success) {
          this.loggedIn = true;
          this.displayOptions.push({name: 'My Favorite', value: 'favorites'});
          // console.log(this.displayOptions)

          this.currentUser = this.authService.getUser();
          this.currentUserAbbvName = this.currentUser.name.split(' ').map((n) => n[0]).join('');

          if (this.currentUser && this.currentUser.favorites !== []) {
            this.courses.forEach((item, index) => {
              if (this.currentUser.favorites.indexOf(this.courses[index]._id) !== -1) {
                this.courses[index].isFavorited = true;
              } else {
                this.courses[index].isFavorited = false;
              }
            });
          } else {
            // Should remove my favorite
            this.removeFavoriteOption();
          }
        }

        // console.log(this.currentUser);
      },
      (err) => {
        // console.log(err);
      }
    );

    this.sub = this.route.data.subscribe(
      (data: Data) => {
        if (data.coursedoc) {
          // console.log(data.coursedoc);
          this.courses = data.coursedoc.docs;
          this.totalPages = data.coursedoc.pages;
          setTimeout( () => {
            const screenClass = this.ssService.sizeClass();
            if (screenClass === 'xs' || screenClass === 'sm') {
              this.cGridWidth = this.cElement.nativeElement.offsetWidth / 3;
            } else {
              this.cGridWidth = this.cElement.nativeElement.offsetWidth;
            }
            // console.log(this.cElement.nativeElement.offsetWidth);
            }, 100);
        }

        if (data.categories) {
          this.categories = data.categories;
        }
      }
    );
  }

  ngAfterViewInit() {
    // const cs = localStorage.getItem('currentDisplay');
    setTimeout(() => {
      if (this.cs) {
      } else {
        this.currentDisplay = 'Latest';
      }
    }, 0);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onGridSelect(grid: number) {
    this.gridCol = grid;
    localStorage.setItem('grid-col', this.gridCol.toString());
  }

  onModalPop(course: Course) {
    this.courseService.quickClicked(course);
    this.modalService.popModal(course.youtube_ref);
  }

  toggleMenu() {
    if ( !this.menuOpen ) {
      setTimeout(() => {
        this.menuOpenForStyle = !this.menuOpenForStyle;
      }, 400);
    } else {
      this.menuOpenForStyle = !this.menuOpenForStyle;
    }
    this.menuOpen = !this.menuOpen;
  }

  changeDisplayTo(option) {
    this.loading = true;

    this.store.dispatch(setCurrentDisplay({currentDisplay: option.name}));
    // localStorage.setItem('currentDisplay', option.name);
    this.currentDisplay = option.name;
    this.cs = option.value;
    this.page = 1;
    this.toggleMenu();
    let courses$;

    if (this.loggedIn && option.value === 'favorites') {
      courses$ = this.courseService.getFavoritedCourses(6, this.page);
    } else {
      courses$ = this.courseService.all(6, option.value, this.page);
    }
    courses$.subscribe(
      (coursedoc: CourseDoc) => {
        this.courses = coursedoc.docs;
        this.runCheckFavorites(this.courses);
        this.loading = false;
      },
      (error) => {
        console.log('Something went wrong!');
        this.loading = false;
      }
    );
  }

  onScroll() {
    // console.log('scrolled!!');
    this.loadingmore = true;
    this.page += 1;
    let course$: Observable<any>;

    if (this.loggedIn && this.cs === 'favorites') {
      course$ = this.courseService.getFavoritedCourses(6, this.page);
    } else {
      if (this.cs === 'favorites') {
        this.cs = 'publishedDate';
        this.changeDisplayTo({name: 'Latest', value: 'publishedDate'});
      }
      course$ = this.courseService.all(6, this.cs, this.page);
    }
    course$.subscribe(
      (newcoursedoc: CourseDoc) => {
        // console.log(newcoursedoc);
        for ( const doc of newcoursedoc.docs) {
          if (this.currentUser && this.currentUser.favorites !== []) {
            if (this.currentUser.favorites.indexOf(doc._id) !== -1) {
              doc.isFavorited = true;
            } else {
              doc.isFavorited = false;
            }
          }
          this.courses = [ ...this.courses, doc];
        }

        if (this.page === this.totalPages) {
          this.finished = true;
          // console.log('finished.');
        }

        this.loadingmore = false;
      },
      (err) => {
        // console.log(err);
        this.router.navigate(['/maintenance']);
        return [];
      }
    );
  }

  onNavigate(e) {
    e.stopPropagation();
  }

  onToggleFavorite(e, cid: string) {
    e.stopPropagation();
    if (!this.loggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/' }});
      return;
    }
    this.favService.toggleFav(cid).subscribe(
      (res) => {
        // tslint:disable-next-line:no-string-literal
        if (res['success']) {
          this.courses.forEach((item, index) => {
            if (this.courses[index]._id === cid) {
              this.courses[index].isFavorited = !this.courses[index].isFavorited;
            }
          });
          this.favService.ToggleFavAndupdateInLocalStorage(cid);
        }
      }, (error) => {
      }
    );
  }
  removeFavoriteOption() {
    this.displayOptions.forEach((option, index) => {
      if (this.displayOptions[index].value === 'favorites') {
        this.displayOptions.splice(index, 1);
      }
    });
  }

  runCheckFavorites(docs) {
    for ( const doc of docs) {
      if (this.currentUser && this.currentUser.favorites !== []) {
        if (this.currentUser.favorites.indexOf(doc._id) !== -1) {
          doc.isFavorited = true;
        } else {
          doc.isFavorited = false;
        }
      }
    }
  }
}
