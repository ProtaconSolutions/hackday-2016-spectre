import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { LoginModule } from './login/login.module';
import { TeamsModule } from './teams/teams.module';
import { TagsModule } from './tags/tags.module';
import { LayoutModule } from './layout/layout.module';
import { RetrosModule } from "./retros/retros.module";
import { BlankModule } from './blank/blank.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    LayoutModule,
    BlankModule,
    LoginModule,
    TagsModule,
    TeamsModule,
    RetrosModule,
  ],
  bootstrap: [
    AppComponent,
  ]
})

export class AppModule { }
