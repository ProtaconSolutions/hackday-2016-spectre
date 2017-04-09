import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BlankComponent } from './index';
import { BlankRoutingModule } from './blank-routing.module';

@NgModule({
  imports: [
    SharedModule,
    BlankRoutingModule,
  ],
  declarations: [
    BlankComponent,
  ],
  exports: [
    BlankComponent,
  ],
})

export class BlankModule { }
