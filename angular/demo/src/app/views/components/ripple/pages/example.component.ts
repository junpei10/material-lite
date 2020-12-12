import { Component } from '@angular/core';
import { MlRippleBinder } from '@material-lite/angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  type: 0 | 1 | 2 = 0;

  disabled: boolean;
  overdrive: boolean;
  centered: boolean;

  theme: string;
  color: string;

  radius: number;
  opacity: number;

  animationDuration: {
    enter?: number;
    leave?: number;
  } = {};
}
