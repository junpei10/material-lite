import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import firebase from 'firebase/app';
import { FIREBASE_CONFIG } from './db/firebase';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

firebase.initializeApp(FIREBASE_CONFIG);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
