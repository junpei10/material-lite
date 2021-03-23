import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MlTheming, ML_DARK_THEME, ML_INDIGO_PINK_PALETTE, ML_LIGHT_THEME, ML_PURPLE_GREEN_PALETTE } from '@material-lite/angular/core';

import firebase from 'firebase/app';
import { FIREBASE_CONFIG } from './db/firebase';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

MlTheming.init([
  { theme: ML_LIGHT_THEME, palette: ML_INDIGO_PINK_PALETTE },
  { theme: ML_DARK_THEME, palette: ML_PURPLE_GREEN_PALETTE, wrapperClass: 'dark-theme' }
]);

firebase.initializeApp(FIREBASE_CONFIG);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
