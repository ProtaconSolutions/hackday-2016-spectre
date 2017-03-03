import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { WarboardRoutingModule } from './warboard-routing.module';
import { WarboardComponent } from './warboard.component';

@NgModule({
  imports: [
    SharedModule,
    WarboardRoutingModule,
  ],
  declarations: [
    WarboardComponent,
  ],
  exports: [
    WarboardComponent,
  ],
})

export class WarboardModule { }
