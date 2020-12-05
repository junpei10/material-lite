import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MlTheme, MlTheming, ML_INDIGO_PINK_PALETTE, ML_LIGHT_THEME } from '@material-lite/angular/core';
import firebase from 'firebase/app';

import { AppModule } from './app/app.module';
import { firebaseConfig } from './db/firebase-config';
import { environment } from './environments/environment';

// firebase.initializeApp(firebaseConfig);
const myTheme: MlTheme = {
  ...ML_LIGHT_THEME,
  primaryContainer: 'white',
  secondaryContainer: '#FAFAFA',
  text: 'black'
};
MlTheming.init(ML_LIGHT_THEME, ML_INDIGO_PINK_PALETTE);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
