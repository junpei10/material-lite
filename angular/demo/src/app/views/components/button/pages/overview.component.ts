import { Component } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styles: [`
    .ml-button {
      height: 36px;
    }
    .ml-fab {
      width: 36px;
    }
    .prod {
      width: 100%;
      padding-top: 8px;
      padding-bottom: 8px;
    }
    .prod .ml-button {
      margin: 8px;
    }
  `]
})
export class OverviewComponent {
}
