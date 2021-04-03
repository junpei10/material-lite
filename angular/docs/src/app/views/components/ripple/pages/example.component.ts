import { Component, ElementRef, ViewChild } from '@angular/core';
import { MlRippleEntrance } from 'src/app/material-lite/components/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  @ViewChild('triggerRef', { static: true, })
  set onSetRef(elementRef: ElementRef<HTMLElement>) {
    this.trigger = elementRef.nativeElement;
  }

  disabled: boolean = true;
  overdrive: boolean;

  theme: string;
  color: string;

  radius: number;
  opacity: number;

  animation: {
    enter?: number;
    leave?: number;
  } = {};

  entrance: MlRippleEntrance;

  trigger: HTMLElement | null;

  constructor(
    docs: DocsService
  ) { docs.setActiveRoute('example'); }
}
