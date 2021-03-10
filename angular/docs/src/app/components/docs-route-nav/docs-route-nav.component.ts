import { ChangeDetectionStrategy, Component, SkipSelf, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-docs-route-nav',
  templateUrl: './docs-route-nav.component.html',
  styleUrls: ['./docs-route-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DocsRouteNavComponent {

  constructor(
    @SkipSelf() public docs: DocsService,
    private _router: Router,
  ) {}

  goToLink(route: string): void {
    const router = this._router;

    const urlArr: string[] = router.url.split('/');

    urlArr[urlArr.length - 1] = route;

    const entryRoute = urlArr.join('/');

    router.navigate([entryRoute]);
  }

}
