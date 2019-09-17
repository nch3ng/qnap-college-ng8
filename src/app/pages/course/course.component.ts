import { EventBrokerService } from './../../_services/event.broker.service';
import { CommentsService } from './../../_services/comment.service';
import { UsersService } from './../../auth/_services/users.service';
import { AuthService } from './../../auth/_services/auth.service';
import { CourseDoc } from './../../_models/document';
import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, ApplicationRef } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddThisService } from '../../_services/addthis.service';
import { MetaService } from '@ngx-meta/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ReCaptchaV3Service, InvisibleReCaptchaComponent } from 'ngx-captcha';
import { ConfirmService } from '../../_services/confirm.service';
import { AddScriptService } from '../../_services/addscript.service';
import { FavService } from '../../_services/favorite.service';

// declare let gapi: any;

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy, AfterViewInit {

  sub: Subscription;
  routeSub: Subscription;
  addThisSub: Subscription;
  course: Course;
  courses: Course [];
  youtubeSrc;
  keywords;
  comments: any [];
  currentUser = null;
  currentGUser = null;
  loggedIn = false;
  returnUrl = '';
  currentUserAbbvName = 'JD';
  commentError = false;
  favorited = false;
  commentErrorMessage = 'Please make sure the comment format is correct.';
  private cdr: ChangeDetectorRef;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaResponse?: string;
  public captchaIsReady = false;

  public badge: 'bottomleft' | 'bottomright' | 'inline' = 'inline';
  public type: 'image' | 'audio';

  public recaptcha: any = null;

  public commentEnabled = false;

  comment = '';

  @ViewChild('captchaElem', { static: false }) captchaElem: InvisibleReCaptchaComponent;
  @ViewChild('langInput', { static: false }) langInput: ElementRef;

  public readonly siteKey = environment.recapctchaSitekey;
  recaptchaToken = null;
  commentLength = 0;
  // siteKey = '6LeVt3cUAAAAADO9qIyWsIHZOaiFUKr0PwWvVes9';

  loading = false;
  GoogleAuth: any = null;
  isGoogleSignedIn = false;
  isAuthorized = false;
  currentApiRequest: any = {};

  constructor(
    private _route: ActivatedRoute, 
    private _courseService: CourseService, 
    private _router: Router,
    private _addThis: AddThisService,
    private readonly _meta: MetaService,
    private _toastr: ToastrService,
    private _authService: AuthService,
    private _usersService: UsersService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private _CommentsService: CommentsService,
    private _eventBroker: EventBrokerService,
    private _confirmService: ConfirmService,
    private _addScript: AddScriptService,
    private _favService: FavService) {

    this._courseService.all(4, 'watched').subscribe(
      (coursedoc: CourseDoc) => {
        this.courses = coursedoc.docs;
      },
      (error) => {
        console.log('Something went wrong');
      }
    );

    this.keywords = '';

    // gapi.load('client:auth2', () => {
    //   console.log('client:auth2 loaded');

    //   gapi.auth2.init({
    //     'clientId': environment.GoogleClientID,
    //     // 'apiKey': environment.GoogleYoutubeAPIKey,
    //     'scope': 'profile email',
    //     'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    //   }).then((onInit) => {
    //     console.log('auth2 initialized')
    //     this.GoogleAuth = gapi.auth2.getAuthInstance();
    //     this.isGoogleSignedIn = this.GoogleAuth.isSignedIn.get();
    //     // Listen for sign-in state changes.
    //     this.GoogleAuth.isSignedIn.listen(this.signinChanged.bind(this));
    //     // Listen for changes to current user.
    //     this.GoogleAuth.currentUser.listen(this.userChanged.bind(this));

    //     // if (this.GoogleAuth.isSignedIn.get() == true) {
    //     //   this.GoogleAuth.signIn();
    //     // }
    //   }, (onError) => {
    //     console.error(onError);
    //   });
    // });
  }

  ngOnInit() {
    this.commentEnabled = environment.comment_enable;

    this._meta.setTitle('QNAP College - Get the Most out of Your QNAP NAS');
    this._meta.setTag('og:image', '//img.youtube.com/vi/tcGIYGr4guA/sddefault.jpg');
    this._meta.setTag('og:type', 'video.other');
    this._meta.setTag('og:description', 'Course description');
    this._meta.setTag('og:url', 'https://college.qnap.com/course/5b5105d1e449ca649bbc1675');

    this._authService.verify().subscribe(
      (res) => {
        if (res && res.success) {
          this.loggedIn = true;
          this.currentUser = this._authService.getUser();
          // console.log(this.currentUser);
          this.currentUserAbbvName = this.currentUser.name.split(" ").map((n)=>n[0]).join("")
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.sub = this._route.params.subscribe(params => {
    });

    this.routeSub = this._route.data.subscribe(
      (data: Data) => {
        if (data.course) {
          this.course = data.course;
          this._courseService.quickClicked(this.course);
          this.youtubeSrc = 'https://www.youtube.com/embed/' + this.course.youtube_ref;
          this.course.tags = this.course.keywords.split(',');
          // console.log(this.course);

          this._courseService.allCommentsByCourseId(this.course._id).subscribe(
            (comments) => {
              this.comments = comments;
              let i = 0;
              for (let comment of this.comments) {
                let idx = i;
                this._usersService.getAbbv(comment['owner_id']).subscribe(
                  (res) => {
                    this.comments[idx]['poster_name'] = res['name'];
                    // console.log(idx);
                    // console.log(this.comments);
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                i++;
              }
            },
            (error) => {
              this._toastr.error('Couldn\'t get comments')
            }
          );

          this._favService.isFav(data.course._id).subscribe(
            (res) => {
              console.log(res);
              if (res) {
                if (res["payload"]["favorite"] === true){
                  this.favorited = true;
                }
              }
            },
           (httpErrorRes) => {
              // console.log(httpErrorRes.error)
              if (httpErrorRes.error.status === 401){

              } else {
                this._toastr.error('Some errors.');
              }
            }
          )
          // this._meta.setTitle(`${this.course.title}`);
          // this._meta.setTag('og:image', `//img.youtube.com/vi/${this.course.youtube_ref}/sddefault.jpg`);
          // let params: UIParams = {
          //   method: 'share_open_graph',
          //   action_type: 'og.shares',
          //   action_properties: JSON.stringify({
          //     object : {
          //       'og:url': `//college.qnap.com/course/${this.course._id}`, // your url to share
          //       'og:title': `${this.course.title}`,
          //       'og:site_name': 'QNAP College',
          //       'og:description': `${this.course.desc}`,
          //       'og:image': `//img.youtube.com/vi/${this.course.youtube_ref}/sddefault.jpg`,//
          //       'og:image:width':'250',//size of image in pixel
          //       'og:image:height':'257',
          //       'og:image:type': 'image/jpeg'
          //     }
          //   })
          // }
        }
      });

    this.returnUrl = this._route.snapshot['_routerState'].url;
  }

  ngAfterViewInit() {
    const sitekey = environment.recapctchaSitekey;
    this._addScript.addScript('https://www.google.com/recaptcha/api.js', { render: sitekey });
    window.scrollTo(0, 0);
    this.addThisSub = this._addThis.initAddThis('ra-5a0dd7aa711366bd', false).subscribe();

    // debugger
    this._meta.setTag('og:title', 'This is course of ' + this.course.title);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.routeSub.unsubscribe();
    this.addThisSub.unsubscribe();
    this._meta.removeTag('property="og:type"');
  }

  onSubmit(f: NgForm) {
    this._router.navigate(['/search', f.value.keywords]);
  }

  checkForScript() {
    let scriptOnPage = false;
    const selector = 'script[src*="addthis_widget.js"]';
    const matches = document.querySelectorAll(selector);
    if(matches.length > 0) {
        scriptOnPage = true;
    }
    return scriptOnPage;
  }

  onSignout(e) {
    e.stopPropagation();
    // remove user from local storage to log user out
    this.setloading(true);
    this.loggedIn = false;
    localStorage.removeItem('currentUser');
    const url = this._route.snapshot['_routerState'].url;
    setTimeout(() => {
      this.setloading(false);
      this._router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this._router.navigate([url]));
    }, 500)
    // this._authService.logout();
  }

  addScript() {
    // if script is already on page, do nothing
    if (this.checkForScript()) {
      return;
    }

    const profileId = 'ra-5a0dd7aa711366bd';
    const baseUrl = '//s7.addthis.com/js/300/addthis_widget.js';
    const scriptInFooter = true;
    var url;

    if(profileId) {
        // preference the site's profile ID in the URL, if available
        url = baseUrl + '#pubid=' + profileId;
    } else {
        url = baseUrl;
    }

    // create SCRIPT element
    let script = document.createElement('script');
    script.src = url;

    // append SCRIPT element

    if(scriptInFooter !== true && typeof document.head === 'object') {
      document.head.appendChild(script);
    } else {
      document.body.appendChild(script);
    }
  };

  setloading(value: boolean) {
    this._eventBroker.emit<boolean>("loading", value);
  }

  onEnterComment(e) {
    
    // console.log(e.keyCode);
    let comment_html = e.target.value;
    comment_html = comment_html.replace(/\r?\n/g, '<br />');
    // console.log(this.comment);
    this.setloading(true);
    this.reCaptchaV3Service.execute(this.siteKey, 'postcomment', (token) => {
      // console.log('This is your token: ', token);
      this.recaptchaToken = token

      if(e.target.value.length < 32) {
        this.commentErrorMessage = 'The comment must be longer than 32 characters.';
        this.commentError = true;
        this.setloading(false);
        return;
      } else if (e.target.value.length > 512) {
        this.commentErrorMessage = 'The comment can not be longer than 512 characters.';
        this.commentError = true;
        this.setloading(false);
        return;
      } else {
        this.commentError = false;
      }
      this._CommentsService.post(this.course._id, comment_html, this.recaptchaToken).subscribe(
        (res) => {
          
          // console.log(res);
          this.comment = '';
          this.commentLength = e.target.value.length + 1;

          this._courseService.allCommentsByCourseId(this.course._id).subscribe(
            (comments) => {
              this.comments = comments;
              let i = 0;
              for (let comment of this.comments) {
                let idx = i;
                this._usersService.getAbbv(comment['owner_id']).subscribe(
                  (res) => {
                    this.comments[idx]['poster_name'] = res['name'];
                    // console.log(idx);
                    // console.log(this.comments);
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                i++;
              }
            },
            (error) => {
              this._toastr.error('Couldn\'t get comments')
            });
          this.setloading(false);
        },
        (err) => {
          console.log(err);
          this.comment = '';
          this.commentLength = e.target.value.length+1;
          this.setloading(false);
        }
      );
    }, {
      useGlobalDomain: false // optional
    });
  }

  onCommentCheckBlur(e) {
    this.commentLength = e.target.value.length+1;

    if(e.target.value.length < 32 && e.target.value.length > 0) {
      this.commentErrorMessage = 'The comment must be longer than 32 characters.';
      this.commentError = true;
    } else if (e.target.value.length > 512) {
      this.commentErrorMessage = 'The comment can not be longer than 512 characters.';
      this.commentError = true;
    } else {
      this.commentError = false;
    }
  }

  onCommentCheckChange(e) {
    this.commentLength = e.target.value.length+1;

    if(this.commentError) {
      if(e.target.value.length >= 32 || e.target.value.length === 0 || e.target.value.length <= 512) {
        this.commentError = false;
      }
    }
    if (e.target.value.length > 512) {
      this.commentError = true;
      this.commentErrorMessage = 'The comment can not be longer than 512 characters.';
    }
  }
  onDelete(commentId) {
    this._confirmService.open("Do you want to delete the comment?").then(
      () => {
        this.setloading(true);
        setTimeout(() => {
          this._CommentsService.delete(commentId).subscribe(
            (res) => { 
              if (res && res.success) {
                for (let i = 0; i < this.comments.length; i = i+1) {
                  if (commentId === this.comments[i]._id) {
                    const coms = this.comments.slice();
                    coms.splice(i, 1);
                    this.comments = coms;
                  }
                }
                this.setloading(false);
                this._toastr.success('Successfully deleted the comment');
              } else {
                this.setloading(false);
                this._toastr.success('Nothing happened');
              }
            },
            (err) => {
              this.loading = false;
              this._toastr.error('Something went wrong.')
            }
          ); 
        }, 1000)  
    }).catch(()=>{})
  }

  execute(): void {
    this.captchaElem.execute();
  }

  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
  }

  handleReady(): void {
    this.captchaIsReady = true;
  }

  onThumbup(): void {
    console.log(this.GoogleAuth)
    if (!this.isGoogleSignedIn) {
      console.log('not siged in')
    } else {
      console.log('signed in')
    }
    // gapi.load('client:auth2', () => {
    //   this.GoogleAuth = gapi.auth2.getAuthInstance();
    //   console.log('client:auth2 loaded');
    //   gapi.auth2.init({
    //     'clientId': environment.GoogleClientID,
    //     // 'apiKey': environment.GoogleYoutubeAPIKey,
    //     'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
    //     'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    //   }).then((onInit) => {
    //     this.GoogleAuth = gapi.auth2.getAuthInstance();
    //     this.isSignedIn = this.GoogleAuth.isSignedIn.get();

    //     if (!this.isSignedIn) {
    //       // this.GoogleAuth.signIn();
    //       this.GoogleAuth.signIn();
    //     }
    //     else {
    //       gapi.client.init({
    //         'clientId': environment.GoogleClientID,
    //         'apiKey': environment.GoogleYoutubeAPIKey,
    //         'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
    //         'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    //       }).then(() => {
    //         // console.log(gapi.auth2.getAuthInstance().signIn())
    //         gapi.client.youtube.videos.rate({
    //           "id": "J5yhBpsPSFU",
    //           "rating": "like"
    //         })
    //           .then(function(response) {
    //             // Handle the results here (response.result has the parsed body).
    //             console.log("Response", response);
    //           },
    //           function(err) { console.error("Execute error", err); });
    //       });
    //     }
    //     this.GoogleAuth.isSignedIn.listen(this.updateSigninStatus.bind(this));
    //   }, (onError) => {
    //     console.log(onError);
    //   });
    // });
  }

  // sendAuthorizedApiRequest(requestDetails) {
  //   // console.log('sendAuthorizedApiRequest')
  //   this.currentApiRequest = requestDetails;
  //   if (this.isAuthorized) {
  //     // Make API request
  //     // gapi.client.request(requestDetails)
  //     gapi.client.init({
  //       'clientId': environment.GoogleClientID,
  //       'apiKey': environment.GoogleYoutubeAPIKey,
  //       'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
  //       'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
  //     }).then(() => {
  //       // console.log(gapi.auth2.getAuthInstance().signIn())
  //       gapi.client.youtube.videos.rate({
  //         "id": "J5yhBpsPSFU",
  //         "rating": "like"
  //       })
  //           .then(function(response) {
  //                   // Handle the results here (response.result has the parsed body).
  //                   console.log("Response", response);
  //                 },
  //                 function(err) { console.error("Execute error", err); });
  //     });

  //     // Reset currentApiRequest variable.
  //     this.currentApiRequest = {};
  //   } else {
  //     this.GoogleAuth.signIn();
  //   }
  // }

  // updateSigninStatus(isSignedIn) {
  //   console.log('updateSigninStatus')
  //   if (isSignedIn) {
  //     console.log(this);
  //     this.isAuthorized = true;
  //     if (this.currentApiRequest) {
  //       this.sendAuthorizedApiRequest(this.currentApiRequest);
  //     }
  //   } else {
  //     this.isAuthorized = false;
  //   }
  // }

  /**
   * Listener method for sign-out live value.
   *
   * @param {boolean} val the updated signed out state.
   */
  signinChanged = (val) => {
    console.log('Signin state changed to ', val);
  };


  /**
   * Listener method for when the user changes.
   *
   * @param {GoogleUser} user the updated user.
   */
  userChanged = (user) => {
    console.log('User now: ', user);
    this.currentGUser = user;
  };
  toggleFav(): void {
    if(!this.loggedIn) {
      this._router.navigate(['/login'], { queryParams: { returnUrl: this.returnUrl }})
      return;
    }
    this._favService.toggleFav(this.course._id).subscribe(
      (res) => {
        if (res['success']) {
          this.favorited = !this.favorited;
          this._favService.ToggleFavAndupdateInLocalStorage(this.course._id);
        }
      }, (error) =>{
      }
    )
  }
};