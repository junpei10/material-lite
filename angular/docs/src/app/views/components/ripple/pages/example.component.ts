import { Component } from '@angular/core';
import { MlRippleEntrance } from 'src/app/material-lite/components/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  disabled: boolean;
  overdrive: boolean;

  theme: string;
  color: string;

  radius: number;
  radiusMagnification: number;
  opacity: number;

  animation: {
    enter?: number;
    leave?: number;
  } = {};

  entrance: MlRippleEntrance;

  constructor(
    docs: DocsService
  ) { docs.setActiveRoute('example'); }
}
