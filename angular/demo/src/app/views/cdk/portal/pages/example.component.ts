import { Component } from '@angular/core';
import { MlPortalConfig, MlPortalContent } from '@material-lite/angular-cdk/portal';
import { Class } from '@material-lite/angular-cdk/utils';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  type: 0 | 1 | 2 = 0;

  portalContent: MlPortalContent;
  portalConfig: MlPortalConfig = {};

  componentPortalContent: Class<any> = ComponentPortalContent;
}

@Component({
  selector: 'app-component-portal-content',
  template: '<h1>Component</h1>'
})
// tslint:disable-next-line:component-class-suffix
export class ComponentPortalContent { }
