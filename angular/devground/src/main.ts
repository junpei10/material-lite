import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { MlTheming, ML_DEEPPURPLE_AMBER_PALETTE, ML_LIGHT_THEME } from '@material-lite/angular/core';

MlTheming.init(ML_LIGHT_THEME, ML_DEEPPURPLE_AMBER_PALETTE);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
