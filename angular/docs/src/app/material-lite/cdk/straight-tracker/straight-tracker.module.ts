import { NgModule } from '@angular/core';
import { MlStraightTrackerDirective } from './straight-tracker.directive';

@NgModule({
  declarations: [MlStraightTrackerDirective],
  exports: [MlStraightTrackerDirective],
})
export class MlStraightTrackerModule { }
