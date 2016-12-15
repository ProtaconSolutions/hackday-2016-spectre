import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RetrosRoutingModule } from './retros-routing.module';
import { RetrosComponent } from './retros.component';

@NgModule({
  imports: [
    SharedModule,
    RetrosRoutingModule,
  ],
  declarations: [
    RetrosComponent,
  ],
  exports: [
    RetrosComponent,
  ],
})

export class RetrosModule { }
