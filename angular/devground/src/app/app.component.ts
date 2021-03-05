import { animate, query, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, DoCheck, ElementRef, Inject, OnInit, Optional, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { MlPortalAttachConfig, MlPortalAttachedRef, MlPortalContent, MlPortalOutlet } from '@material-lite/angular-cdk/portal';
import { MlTheming } from '@material-lite/angular/core';
import { environment } from 'src/environments/environment';
import { ML_DATA, ML_REF } from 'src/material-lite/cdk/utils';
import { MlCssVariables } from 'src/material-lite/components/core/theme/css-theme-variables.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  @ViewChild('test', { static: true }) private _templateRef: TemplateRef<any>;
  @ViewChild('testDOM', { static: true }) private _domRef: ElementRef<HTMLElement>;

  title = 'devground';
  portalContent: MlPortalContent | false;
  portalConfig: MlPortalAttachConfig = {
    animation: {
      className: 'test',
      enter: 500,
      leave: 500,
    },
    component: {
      injectionData: 'injection data',
    },
    // cloneDOM: true
  };

  index: number = 0;
  width: number = 100;

  ngIf = true;
  innerHTML: string = '<div>First div</div>';

  overdrive = {
    width: 500,
    height: 500
  };
  ripple = {
    enter: 100,
    leave: 100
  };

  templateContent: TemplateRef<any> | null;

  list: number[] = [0, 1, 2, 3, 4, 5];

  outletHasShown = true;

  constructor(
    private renderer: Renderer2,
    private portalOutlet: MlPortalOutlet,
    private cssVariable: MlCssVariables,
  ) {
    const themeValue = MlTheming.value.null;
    this.cssVariable.set(themeValue.theme, themeValue.palette);
  }

  ngOnInit(): void {
    console.log('レンダリングまでの時間', performance.now() - environment.start);

    this.templateContent = this._templateRef;
  }

  ngDoCheck(): void {
    console.log('do');
  }

  attachPortal(): void {
    const ref = this.portalOutlet.attach(TestComponent, 'test', this.portalConfig);
    console.log(ref);

    if (ref.data.isFirstAttached) {
      ref.lifecycle.beforeDetach().subscribe(() => console.log('before'));
      ref.lifecycle.afterDetach().subscribe(() => console.log('after'));

      setTimeout(() => {
        console.log('test');
        ref.detach();
      }, 2000);
    }
  }

  onAttachPortal(): void {
    setTimeout(() => {
      this.portalContent = false;
    }, 3000);
  }

  changeList(): void {
    this.list = this.list.length === 5
      ? [0, 1, 2, 3, 4, 5]
      : [0, 1, 2, 3, 5];
  }
}

@Component({
  selector: 'app-test',
  template: `<h1>TEST {{ data }} </h1>`
})
class TestComponent implements OnInit {
  constructor(
    @Inject(ML_DATA) public data: string,
    @Inject(ML_REF) public ref: MlPortalAttachedRef
  ) {
    console.log(ref, data);
    console.log(this.ref.data.rootContentElement);
  }

  ngOnInit(): void {
    console.log(this.ref.data.rootContentElement);
    // console.log(this.ref, this.ref.contentData.type);
  }
}

