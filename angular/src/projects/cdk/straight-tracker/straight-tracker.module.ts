import { NgModule } from '@angular/core';
import { insertStyleElement } from '@material-lite/angular-cdk/utils';
import { MlStraightTrackerDirective } from './straight-tracker.directive';

insertStyleElement('.ml-straight-tracker{position:absolute;transition-timing-function:cubic-bezier(0.35, 0, 0.25, 1)}');

@NgModule({
  declarations: [MlStraightTrackerDirective],
  exports: [MlStraightTrackerDirective],
})
export class MlStraightTrackerModule { }
