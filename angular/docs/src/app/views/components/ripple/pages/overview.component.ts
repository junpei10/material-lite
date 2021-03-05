import { Component } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styles: [`
    .docs-codeblock-prod {
      padding: 8px;
    }
    .ml-ripple {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #9E9E9E;
      box-sizing: border-box;
      margin: 8px 16px;
    }
    .first-prod .ml-ripple {
      width: 80px;
      height: 80px;
    }
    .second-prod .ml-ripple, .fourth-prod .ml-ripple {
      width: 160px;
      height: 80px;
    }
    .fourth-prod {
      display: flex;
      flex-direction: column;
    }
    .forth-prod-wrapper {
      display: flex;
      width: 100%;
      justify-content: space-around;
    }
    .third-form button {
      margin: 0 8px;
    }
    .third-form span {
      font-size: 14px;
    }
    .third-form code {
      font-size: 16px;
      font-weight: bold;
    }
  `]
})
export class OverviewComponent {
  typeBpViewer = 0;
  typeBpRippleWidth: 250 | 500 = 250;
  typeBpRippleHeight: 250 | 500 = 250;

  triggerVisualizeRipple: boolean;
}
