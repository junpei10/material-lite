import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ML_DEEPPURPLE_AMBER_PALETTE } from './material-lite/theme-constants/palette/deepPurple-amber';
import { ML_LIGHT_THEME } from './material-lite/theme-constants/theme/light';
import { MlTheming } from './material-lite/theming';

MlTheming.init(ML_LIGHT_THEME, ML_DEEPPURPLE_AMBER_PALETTE);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
