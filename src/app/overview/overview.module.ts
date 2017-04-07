import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';

@NgModule({
  imports: [
    SharedModule,
    OverviewRoutingModule,
  ],
  declarations: [
    OverviewComponent,
  ],
  exports: [
    OverviewComponent,
  ],
})

export class OverviewModule { }
