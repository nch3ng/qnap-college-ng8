import { AuthEffects } from './store/effects';
import { AuthService } from './_services/auth.service';
import { RouterModule } from '@angular/router';
import { CommentsResolver } from './../admin/comments/comments.resolver';
import { ConfirmationComponent } from './verification/confirmation';
import { AuthGuard } from './_guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthComponent } from './auth.component';
import { VerificationComponent } from './verification/verification.component';
import { VerificationSuccessComponent } from './verification/success.component/success.component';
import { VerificationFailedComponent } from './verification/failure.component/failure.component';
import { CreatePasswordComponent } from './create.password/create.password.component';
import { ForgetPasswordComponent } from './forget.password.component/forget.password.comonent';
import { PasswordService } from './_services/password.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { FacebookLoginProvider } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { StoreModule } from '@ngrx/store';
import * as fromAuth from './store/reducers';
import { EffectsModule } from '@ngrx/effects';

const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.FBId)
  },
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.GoogleClientID)
  },
]);

export function provideConfig() {
  return config;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    RouterModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    StoreModule.forFeature(fromAuth.authFeatureKey, fromAuth.authReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  declarations: [
    AuthComponent,
    VerificationComponent,
    VerificationSuccessComponent,
    VerificationFailedComponent,
    CreatePasswordComponent,
    ConfirmationComponent,
    ForgetPasswordComponent
  ],
  providers: [
    AuthGuard,
    PasswordService,
    CommentsResolver,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  entryComponents: [
    VerificationSuccessComponent,
    VerificationFailedComponent
  ]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        PasswordService,
        AuthService,
        AuthGuard
      ]
    };
  }
}
