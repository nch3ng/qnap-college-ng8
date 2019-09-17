import { getCourses } from './../../test-data/get-data';
import { CourseDoc } from './../_models/document';
import { COURSES } from './../../test-data/test-data';
import { AuthService } from './../auth/_services/auth.service';
import { CourseService } from './course.service';
import { TestBed, } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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
      expect(courses.docs.length).toBe(6);
      // console.log(courses);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/api/courses?orderBy=publishedDate:desc&page=1');
    expect(req.request.method).toBe('GET');
    req.flush({docs: COURSES.slice(0, 6)});
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
    pending();
  });

  it('should get courses by category', () => {
    pending();
  });

  it('should get courses by tag', () => {
    pending();
  });

  it('should get all comments by course ID', () => {
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
