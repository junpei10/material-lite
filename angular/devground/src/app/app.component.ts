import { Component, DoCheck, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { MlPortalAttachContent, MlPortalOutlet } from '@material-lite/angular-cdk/portal';
import { MlButtonBinder } from '@material-lite/angular/button';
import { MlPopupOutlet } from 'src/material-lite/components/popup/outlet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, DoCheck {
  @ViewChild('test', { static: true }) private _testTemplateRef: TemplateRef<any>;
  title = 'devground';

  button: MlButtonBinder = {
    mlButton: false,
    variant: 'basic',
    hoverAction: 'default',
    theme: undefined,
    disableRipple: false,
    immediateRipple: false,
    immediateRippleBreakpoint: undefined
  };

  outlet: MlPortalAttachContent;

  constructor(
    private renderer: Renderer2,
    private popupOutlet: MlPopupOutlet,
  ) {
  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    console.log('do');
  }
}

@Component({
  selector: 'app-test',
  template: `<h1>TEST</h1>`
})
class TestComponent { }

