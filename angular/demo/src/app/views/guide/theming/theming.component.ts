import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SettingComponent } from './page';

@Component({
  selector: 'app-theming',
  templateUrl: './theming.component.html',
})
export class ThemingComponent {
  pageName: string;

  constructor(
    private _router: Router
  ) { }

  fragmentScrollTo(fragment: string): void {
    this._router.navigate([], { fragment });
  }

  onRouteChange(event): void {
    this.pageName = event instanceof SettingComponent
      ? 'setting'
      : 'scss';
  }
}
