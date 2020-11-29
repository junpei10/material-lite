import { Component } from '@angular/core';
import { MlButtonBinder } from '@material-lite/angular/button';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  type: 0 | 1 | 2 = 0;

  theme: string;
  variant: MlButtonBinder['variant'] = 'basic';
  hoverAction: MlButtonBinder['hoverAction'] = 'default';
  disabled: boolean;
}
