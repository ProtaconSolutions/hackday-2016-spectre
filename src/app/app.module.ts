import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { LoginModule } from './login/login.module';
import { TeamsModule } from './teams/teams.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    LoginModule,
    TeamsModule,
  ],
  bootstrap: [
    AppComponent,
  ]
})

export class AppModule { }
