import { animate, query, style, transition, trigger } from '@angular/animations';
import { Component, DoCheck, Inject, OnInit, Optional, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { MlPortalConfig, MlPortalContent, MlPortalOutlet } from '@material-lite/angular-cdk/portal';
import { MlRippleDirective, MlTheming } from '@material-lite/angular/core';
import { environment } from 'src/environments/environment';
import { ML_DATA, ML_REF } from 'src/material-lite/cdk/utils';
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
  @ViewChild('mlRipple', { static: true }) private _rippleRef: MlRippleDirective;

  title = 'devground';
  portalContent: MlPortalContent | false;
  portalConfig: MlPortalConfig = {
    animation: {
      className: 'test',
      enter: 500,
      leave: 500
    },
    component: {
      injectData: 'test',
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
    console.log('レンダリングまでの時間', performance.now() - environment.start);
    console.log(this._rippleRef);
  }

  ngDoCheck(): void {
    console.log('do');
  }

  attachPortal(): void {
    // this.portalContent = TestComponent;
    const ref = this.portalOutlet.attach(TestComponent, 'test', this.portalConfig);
    ref.beforeDetached().subscribe(() => console.log('Before detach'));
    ref.afterDetached().subscribe(() => console.log('After detach'));
  }

  onAttachPortal(): void {
    setTimeout(() => {
      this.portalContent = false;
    }, 3000);
  }
}

@Component({
  selector: 'app-test',
  template: `<h1>TEST {{ data }} </h1>`
})
class TestComponent implements OnInit {
  constructor(
    @Optional() @Inject(ML_DATA) public data: string,
    @Optional() @Inject(ML_REF) public ref: any
  ) {
    console.log(ref, ref.contentData);
  }

  ngOnInit(): void {
    // console.log(this.ref, this.ref.contentData.type);
  }
}

