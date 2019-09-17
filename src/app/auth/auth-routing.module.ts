import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { CreatePasswordComponent } from './create.password/create.password.component';
import { ForgetPasswordComponent } from './forget.password.component/forget.password.comonent';

const routes: Routes = [
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
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
