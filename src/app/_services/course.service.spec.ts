import { Course } from './../../../../goqnap/server/models/course.model';
import { COURSES } from './test-data';
import { CourseDoc } from './../_models/document';
import { AuthService } from './../auth/_services/auth.service';
import { CourseService } from './course.service';
import { TestBed, } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';

describe('CourseService', async () => {
  let coursesService: CourseService;
  let httpTestingController: HttpTestingController;
  let authServiceSpy: any;
  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['fbLogin']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CourseService,
        { provide: AuthService, useValue:  authServiceSpy}
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    coursesService = TestBed.get(CourseService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should get all courses without params', () => {
    // console.log('get all course');
    coursesService.all().subscribe((courses: CourseDoc) => {
      expect(courses).toBeTruthy();
      expect(courses.docs).toBeTruthy();
      // tslint:disable-next-line:no-string-literal
      expect(courses.docs.length).toBe(COURSES.length);
      // console.log(courses);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/api/courses?orderBy=publishedDate:desc&page=1');
    expect(req.request.method).toBe('GET');
    req.flush({docs: COURSES.slice()});
  });

  it('should get all courses', () => {
    coursesService.all(0, null, 0).subscribe((courses) => {
      expect(courses).toBeTruthy();
      expect(courses.docs).toBeTruthy();
      // tslint:disable-next-line:no-string-literal
      expect(courses.docs.length).toBe(courses.total);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/api/courses?orderBy=publishedDate:desc&page=1');
    expect(req.request.method).toBe('GET');
    req.flush({
      docs: COURSES,
      total: COURSES.length,
      page: 1,
      pages: 1
    });
  });

  it('should get a course by id', () => {
    const course = COURSES[10];
    coursesService.get(course._id).subscribe(c => {
      expect(c).toBeTruthy();
      expect(c._id).toBe(course._id);
      expect(c.title).toBe(course.title);
    });

    const req = httpTestingController.expectOne(`http://localhost:3000/api/courses/${course._id}`);
    expect(req.request.method).toBe('GET');
    req.flush(course);
    // req.event(new HttpResponse<Course>({body: course[10]}));
  });

  it('should get courses by category', () => {

    const courses = COURSES.filter( (c) => c.category === 'webinar');
    coursesService.allByCategory('webinar').subscribe((cs) => {
      expect(cs).toBeTruthy();
      expect(cs.length).toBe(courses.length);
      expect(cs[0]._id).toBe(courses[0]._id);
    });
    const req = httpTestingController.expectOne(`http://localhost:3000/api/category/webinar/courses`);
    expect(req.request.method).toBe('GET');
    req.flush(courses);

  });

  it('should get courses by tag', () => {
    const courses = COURSES.filter( (c) => {
      const keywords = c.keywords.toLowerCase().split(',');
      if (keywords.includes('backup')) {
        return true;
      // tslint:disable-next-line:curly
      } else return false;
    });
    coursesService.allByTag('backup').subscribe((cs) => {
      expect(cs).toBeTruthy();
      expect(cs.length).toBe(courses.length);
      expect(cs[0]._id).toBe(courses[0]._id);
    });

    const req = httpTestingController.expectOne(`http://localhost:3000/api/tag/backup`);
    expect(req.request.method).toBe('GET');
    req.flush(courses);
  });

  it('should get all comments by course ID', () => {
    const course = COURSES.filter((c) => c._id === '5cf6aa0f7b38191f6ee39e2e')[0];
    const comments = course.comments;
    console.log(comments);
    pending();
  });

  it('should get course by slug', () =>  {
    pending();
  });

  it('should get Youtube info by course/youtube reference', () => {
    pending();
  });

  it('should search course', () => {
    pending();
  });

  it('should add click # when called click', () =>  {
    pending();
  });

  it('should add a course if logged in', () => {
    pending();
  });

  it('should not add a course if not logged in', () => {
    pending();
  });

  it('should update a course if logged in', () => {
    pending();
  });
  it('should not update a course if not logged in', () => {
    pending();
  });

  it('should delete a course if logged in', () => {
    pending();
  });
  it('should not delete a course if not logged in', () => {
    pending();
  });

  it('should get click status by date period', () => {
    pending();
  });
});
