import { Component, DoCheck, TemplateRef, ViewChild } from '@angular/core';
import { MlPopupOutlet } from 'src/material-lite/core/popup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements DoCheck {
  @ViewChild('test') private _testRef: TemplateRef<any>;
  title = 'devground';

  buttonVariant = 'icon';
  buttonDisabled: boolean;

  constructor(
    private _mlPopupOutlet: MlPopupOutlet
  ) { }

  ngDoCheck(): void {
    console.log('do');
  }

  buttonClick(): void {
    const v = this.buttonVariant;
    this.buttonVariant = v === 'icon' ? 'basic' : 'icon';

    const dis = this.buttonDisabled;
    this.buttonDisabled = !this.buttonDisabled;
  }
}

@Component({
  selector: 'app-test',
  template: `<h1>TEST</h1>`
})
class TestComponent { }

