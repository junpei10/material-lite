import { Component, DoCheck, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { MlPortalAttachContent } from '@material-lite/angular-cdk/portal';
import { MlPopupOutlet } from '@material-lite/angular-cdk/popup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, DoCheck {
  @ViewChild('test', { static: true }) private _testTemplateRef: TemplateRef<any>;
  title = 'devground';
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

