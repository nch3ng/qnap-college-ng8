import { ForgetPasswordComponent } from './auth/forget.password.component/forget.password.comonent';
import { AuthComponent } from './auth/auth.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ConfirmationComponent } from './auth/verification/confirmation';
import { CreatePasswordComponent } from './auth/create.password/create.password.component';
import { AuthGuard } from './auth/_guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerificationComponent } from './auth/verification/verification.component';

const routes: Routes = [
  {
    // path: '', component: PagesComponent
    path: '',
    loadChildren: () => import('./pages/pages.module').then(m =>  m.PagesModule),
  },
  {
    path: 'login', component: AuthComponent
  },
  {
    path: 'signup', component: AuthComponent
  },
  {
    path: 'create-password', component: CreatePasswordComponent
  },
  {
    path: 'forget-password', component: ForgetPasswordComponent
  },
  {
    path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user/verification/:id', component: VerificationComponent
  },
  {
    path: 'user/create-password/:id', component: CreatePasswordComponent
  },
  {
    path: 'confirmation', component: ConfirmationComponent
  },
  {
    path: '**', component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
