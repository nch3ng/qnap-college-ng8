import { SecurityDirective } from './security.directive';
import { NgModule } from '@angular/core';
@NgModule({
  declarations: [SecurityDirective],
  exports:[SecurityDirective]
 })
 export class SecurityModule{}