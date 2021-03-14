import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-theming',
  templateUrl: './theming.component.html',
  providers: [DocsService],
  styles: [`
    .theming-white {
      color: black;
      background: white;
    }
    .theming-black {
      color: white;
      background: black;
    }
    .theming-text {
      color: white;
      background: rgba(0,0,0,.87);
    }
    .theming-bdbdbd {
      color: black;
      background: #BDBDBD;
    }
    .theming-8bc34a {
      background: #8bc34a;
      color: black;
    }
    .theming-673ab7 {
      background: #673ab7;
      color: white;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class ThemingComponent {
  constructor(
    public docs: DocsService,
    private _router: Router
  ) {
    docs.init('guide', 'theming', ['settings', 'scss'], ['Settings', 'Scss']);
  }

  fragmentScrollTo(fragment: string): void {
    this._router.navigate([], { fragment });
  }
}
