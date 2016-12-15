import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TeamsComponent } from './index';
import { AuthenticationGuard } from '../shared';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'teams',
        component: TeamsComponent,
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

export class TeamsRoutingModule { }
