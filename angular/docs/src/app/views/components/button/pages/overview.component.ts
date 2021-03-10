import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styles: [`
    .ml-button {
      height: 36px;
      margin: 8px;
    }
    .ml-fab {
      width: 36px;
    }
    .docs-viewer-content [product] {
      width: 100%;
      padding-top: 8px;
      padding-bottom: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent {
  constructor(docs: DocsService) {
    docs.setActiveRoute('overview', 0);
  }
}
