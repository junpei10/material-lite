import { Component } from '@angular/core';
import { MlStraightTrackerOrientation, MlStraightTrackerPosition, MlStraightTrackerSizingMode, MlStraightTrackerTransitionClasses } from 'src/app/material-lite/cdk/straight-tracker';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: [
    './example.component.css',
    // './example.component.scss'
  ]
})
export class ExampleComponent {
  selectedIndex: number = 0;

  disabled: boolean;

  position: MlStraightTrackerPosition;
  orientation: MlStraightTrackerOrientation;
  sizingMode: MlStraightTrackerSizingMode;

  observeContainer: boolean;
  unobserveTarget: boolean;

  transitionClasses: MlStraightTrackerTransitionClasses = {};

  wrapperClassList: string[] = [];

  constructor(
    docs: DocsService
  ) {
    docs.setActiveRoute('example');
  }

  onChangeOrientation(orientation: MlStraightTrackerOrientation): void {
    const classList = [...this.wrapperClassList];

    if (orientation === 'horizontal') {
      const index = classList.indexOf('vertical');
      if (index !== -1) {
        classList.splice(index, 1);
      }

    } else {
      classList.push('vertical');
    }

    this.wrapperClassList = classList;
  }

  toggleItemSize(): void {
    this._toggleItemWrapperClass('big-size');
  }

  toggleItemBorder(): void {
    this._toggleItemWrapperClass('bold-border');
  }

  private _toggleItemWrapperClass(className: string): void {
    const classList = [...this.wrapperClassList];

    const index = classList.indexOf(className);

    index === -1
      ? classList.push(className)
      : classList.splice(index, 1);

    this.wrapperClassList = classList;
  }
}
