import { Component } from '@angular/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {
  selectedIndex1: number;
  selectedIndex2: number;
  selectedIndex3: number;
  selectedIndex4: number;
  selectedIndex5: number;

  constructor(
    docs: DocsService
  ) {
    docs.setActiveRoute('overview');
  }
}
