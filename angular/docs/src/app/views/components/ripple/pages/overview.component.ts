import { AfterContentInit, AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MlRippleDirective, MlRippleEntrance } from '@material-lite/angular/core';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styles: [`
    [product] {
      padding: 8px;
    }

    .ml-ripple-outlet {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #9E9E9E;
      box-sizing: border-box;
      margin: 8px 16px;
    }

    .first-product .ml-ripple-outlet {
      width: 80px;
      height: 80px;
    }

    .second-product .ml-ripple-outlet, .fourth-product .ml-ripple-outlet{
      width: 160px;
      height: 80px;
    }

    .fifth-product .ml-ripple-outlet {
      width: 160px;
      height: 80px;
      margin: 24px 16px;
    }

    .third-form {
      flex-direction: column;
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

    .fourth-product {
      display: flex;
      flex-direction: column;
    }
    .fourth-product-wrapper {
      display: flex;
      width: 100%;
      justify-content: space-evenly;
    }

    .arrow {
      display: block;
      margin: auto 0;
      font-size: 32px;
      font-weight: 400;
    }

  `]
})
export class OverviewComponent implements AfterViewInit {
  typeBpViewer = 0;
  typeBpRippleWidth: 250 | 500 = 250;
  typeBpRippleHeight: 250 | 500 = 250;

  forthProdTriggerVisualizeRipple: boolean;


  fifthProdRippleIsDisabled: boolean;
  fifthProdTriggerVisualizeRipple: boolean;
  fifthProdTriggerRippleEntrance: MlRippleEntrance = 'resonance';

  @ViewChild('fifthProdRippleRef') fifthProdRipple: MlRippleDirective;

  @ViewChildren('fifthProdTrigger')
  fifthProdTriggers: QueryList<ElementRef<HTMLElement>>;


  constructor(
    docs: DocsService
  ) { docs.setActiveRoute('overview'); }

  ngAfterViewInit(): void {
    const core = this.fifthProdRipple.core;

    this.fifthProdTriggers.forEach((elementRef) => {
      core.addPointerdownListener(elementRef.nativeElement);
    });
  }
}
