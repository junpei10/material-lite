import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DocsService]
})
export class PortalComponent {
  pageName: string;

  constructor(
    docs: DocsService
  ) {
    docs.init('cdk', 'portal');
  }
}
