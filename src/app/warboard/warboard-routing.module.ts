import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WarboardComponent } from './index';
import { AuthenticationGuard } from '../shared';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'warboard',
        component: WarboardComponent,
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

export class WarboardRoutingModule { }
