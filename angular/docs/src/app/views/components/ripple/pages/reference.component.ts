import { Component } from '@angular/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html'
})
export class ReferenceComponent {
  constructor(
    docs: DocsService
  ) { docs.setActiveRoute('reference'); }
}
