import { animate, query, state, style, transition, trigger } from '@angular/animations';
import { Component, DoCheck, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { MlPortalAttachConfig, MlPortalAttachContent, MlPortalOutlet } from '@material-lite/angular-cdk/portal';
import { MlTheming } from '@material-lite/angular/core';
import { MlCssVariables } from 'src/material-lite/components/core/theme/css-theme-variables.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('animation', [
      transition('true <=> false', [
        query(':leave', [
          style({ opacity: 1 }),
          animate('1s', style({ opacity: 0 }))
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          animate('1s', style({ opacity: 1 }))
        ], { optional: true })
      ])
      // state('void', style({ opacity: 0 })),
      // state('*', style({ opacity: 1 })),
      // transition(':enter', animate('.5s', style({ opacity: 1 }))),
      // transition(':leave', animate('.5s', style({ opacity: 0 })))
    ])
  ]
})
export class AppComponent implements OnInit, DoCheck {
  @ViewChild('test', { static: true }) private _testTemplateRef: TemplateRef<any>;

  title = 'devground';
  portalContent: MlPortalAttachContent | false;
  portalConfig: MlPortalAttachConfig = {
    animation: {
      className: 'test',
      enter: 500,
      leave: 500
    }
  };

  ngIf = true;

  constructor(
    private renderer: Renderer2,
    private portalOutlet: MlPortalOutlet,
    private cssVariable: MlCssVariables
  ) {
    const themeValue = MlTheming.value.null;
    this.cssVariable.set(themeValue.theme, themeValue.palette);
  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    console.log('do');
  }

  attachPortal(): void {
    // this.portalContent = TestComponent;
    const ref = this.portalOutlet.attach(TestComponent, 'test', this.portalConfig);
    ref.beforeDetached().subscribe(() => console.log('Before detach'));
    ref.afterDetached().subscribe(() => console.log('After detach'));
    setTimeout(() => {
      this.ngIf = false;
      setTimeout(() => this.ngIf = true, 2000);
    }, 2000);
  }

  onAttachPortal(): void {
    setTimeout(() => {
      this.portalContent = false;
    }, 3000);
  }
}

@Component({
  selector: 'app-test',
  template: `<h1>TEST</h1>`
})
class TestComponent { }

