import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styles: [`
    .types-prod button {
      margin: 0 8px;
    }
  `]
})

export class ButtonComponent {
  constructor() { }
}
