import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-straight-tracker',
  templateUrl: './straight-tracker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DocsService]
})
export class StraightTrackerComponent {
  constructor(
    docs: DocsService
  ) {
    docs.init('cdk', 'straight-tracker');
  }
}
