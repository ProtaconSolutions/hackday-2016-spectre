import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { MomentModule } from 'angular2-moment';
import { Ng2Webstorage } from 'ng2-webstorage';
import { MaterializeDirective } from 'angular2-materialize';

import { Config } from '../config/config';
import { AuthenticationModule } from './authentication/authentication.module';

@NgModule({
  declarations: [
    MaterializeDirective,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AuthenticationModule.forRoot(),
    AngularFireModule.initializeApp(Config.FIREBASE_CONFIG, Config.FIREBASE_AUTH_CONFIG),
    Ng2Webstorage,
  ],
  providers: [],
  exports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AuthenticationModule,
    AngularFireModule,
    MomentModule,
    Ng2Webstorage,
    MaterializeDirective,
  ],
})

export class SharedModule { }
