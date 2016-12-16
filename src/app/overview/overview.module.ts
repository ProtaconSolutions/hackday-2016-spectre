import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { overviewRoutingModule } from './overview-routing.module';
import { overviewComponent } from './overview.component';

@NgModule({
  imports: [
    SharedModule,
    overviewRoutingModule,
  ],
  declarations: [
    overviewComponent,
  ],
  exports: [
    overviewComponent,
  ],
})

export class OverviewModule { }
