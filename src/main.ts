import './polyfills.ts';

// Keep these here for a while
// import 'materialize-css/dist/js/materialize.js';
// import 'materialize-css';
// import 'angular2-materialize';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
