import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ML_DARK_THEME, ML_DEEPPURPLE_AMBER_PALETTE, ML_INDIGO_PINK_PALETTE, ML_LIGHT_THEME } from '@material-lite/angular/core';
import { MlTheming } from '@material-lite/angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Material lite';

  constructor(
    mlTheming: MlTheming,
  ) {
    mlTheming.initialize([
      { theme: ML_LIGHT_THEME, palette: ML_INDIGO_PINK_PALETTE },
      { theme: ML_DARK_THEME, palette: ML_DEEPPURPLE_AMBER_PALETTE, wrapperClass: 'dark-theme' }
    ]);

    mlTheming.setCssVariables({ theme: ML_LIGHT_THEME, palette: ML_INDIGO_PINK_PALETTE });
  }

  // doCount: number = 0;

  // ngDoCheck(): void {
  //   console.log(this.doCount++);
  // }
}
