import { Component, ViewEncapsulation } from '@angular/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-scss',
  templateUrl: 'scss.component.html',
})
export class ScssComponent {
  constructor(
    docs: DocsService
  ) {
    docs.setActiveRoute('scss', 1);
  }
}
