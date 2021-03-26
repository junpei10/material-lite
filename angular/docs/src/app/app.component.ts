import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MlDocument } from '@material-lite/angular-cdk/utils';
import { ML_DARK_THEME, ML_DEEPPURPLE_AMBER_PALETTE, ML_INDIGO_PINK_PALETTE, ML_LIGHT_THEME } from '@material-lite/angular/core';
import { MlTheming } from '@material-lite/angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'Material lite';

  isDarkTheme: boolean;

  constructor(
    mlTheming: MlTheming,
    @Inject(DOCUMENT) private _document: MlDocument,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    mlTheming.initialize(null);
    // mlTheming.initialize([
    //   { theme: ML_LIGHT_THEME, palette: ML_INDIGO_PINK_PALETTE },
    //   { theme: ML_DARK_THEME, palette: ML_DEEPPURPLE_AMBER_PALETTE, wrapperClass: 'dark-theme' }
    // ]);

    // mlTheming.setCssVariables({ theme: ML_LIGHT_THEME, palette: ML_INDIGO_PINK_PALETTE });
    // mlTheming.setCssVariables({ theme: ML_LIGHT_THEME, palette: ML_INDIGO_PINK_PALETTE, wrapperClass: 'dark-theme' });
  }

  // doCount: number = 0;

  // ngDoCheck(): void {
  //   console.log(this.doCount++);
  // }

  toggleDarkTheme(): void {
    if (this.isDarkTheme) {
      this._document.body.classList.remove('dark-theme');
      this.isDarkTheme = false;

    } else {
      this._document.body.classList.add('dark-theme');
      this.isDarkTheme = true;
    }

    this._changeDetectorRef.markForCheck();
  }
}
