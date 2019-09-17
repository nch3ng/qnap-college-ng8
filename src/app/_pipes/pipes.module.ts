import { DurationToTimePipe } from './moment.duration.pipe';
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [
    DurationToTimePipe
  ],
  exports: [
    DurationToTimePipe
  ]
})

export class PipesModule { }