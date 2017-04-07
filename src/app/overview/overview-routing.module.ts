import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../shared';
import { OverviewComponent } from './overview.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'overview',
        component: OverviewComponent,
        canActivate: [
          AuthenticationGuard,
        ],
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
})

export class OverviewRoutingModule { }
