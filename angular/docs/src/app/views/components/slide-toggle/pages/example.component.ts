import { Component } from '@angular/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  theme: string = 'primary';
  checked: boolean;
  disabled: boolean = true;

  constructor(
    docs: DocsService
  ) {
    docs.setActiveRoute('example');
  }
}
