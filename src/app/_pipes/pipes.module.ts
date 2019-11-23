import { DurationToTimePipe } from './moment.duration.pipe';
import { NgModule } from '@angular/core';
import { SafePipe } from './safe.pipe';
import { SafeHTMLPipe } from './safe.html.pipe';

@NgModule({
  declarations: [
    DurationToTimePipe,
    SafePipe,
    SafeHTMLPipe
  ],
  exports: [
    DurationToTimePipe,
    SafePipe,
    SafeHTMLPipe
  ]
})

export class PipesModule { }
