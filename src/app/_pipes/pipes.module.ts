import { DurationToTimePipe } from './moment.duration.pipe';
import { NgModule } from '@angular/core';
import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [
    DurationToTimePipe,
    SafePipe,
  ],
  exports: [
    DurationToTimePipe,
    SafePipe
  ]
})

export class PipesModule { }
