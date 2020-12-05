import { Component, OnInit } from '@angular/core';
import { OverviewComponent, ReferenceComponent } from './pages';

@Component({
  selector: 'app-ripple',
  templateUrl: './ripple.component.html',
  styles: [`
    .ex-ripple {
      width: 300px;
      height: 300px;
      box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
    }
  `]
})
export class RippleComponent implements OnInit {
  pageName: string;
  constructor() { }

  ngOnInit(): void { }

  onRouteChange(event: any): void {
    this.pageName = event instanceof OverviewComponent
      ? 'overview'
      : event instanceof ReferenceComponent
        ? 'reference'
        : 'example';
  }
}
