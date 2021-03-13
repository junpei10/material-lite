import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  providers: [DocsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ButtonComponent {
  pageName: string;

  constructor(
    public docs: DocsService
  ) {
    docs.init('components', 'button');
  }
}
