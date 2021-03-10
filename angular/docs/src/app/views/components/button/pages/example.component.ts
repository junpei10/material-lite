import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MlButtonHoverAction, MlButtonVariant } from '@material-lite/angular/button';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  type: 0 | 1 | 2 = 0;

  theme: string;
  variant: MlButtonVariant = 'basic';
  hoverAction: MlButtonHoverAction = 'auto';
  disabled: boolean;

  constructor(docs: DocsService) {
    docs.setActiveRoute('example', 2);
  }
}
