import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ml-straight-tracker',
  template: '<ng-template></ng-template>',
  styles: ['ml-straight-tracker{width:100%;height:100%;position:absolute;top:0}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MlStraightTrackerComponent {
  @ViewChild(TemplateRef, { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;
}
