import { Component } from '@angular/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styles: [`
    [product] {
      position: relative;
      justify-content: space-evenly !important;
    }
  `]
})
export class OverviewComponent {
  constructor(
    docs: DocsService
  ) {
    docs.setActiveRoute('overview');
  }
}
