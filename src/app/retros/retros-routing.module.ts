import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RetrosComponent } from './index';
import { AuthenticationGuard } from '../shared';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'retros',
        component: RetrosComponent,
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

export class RetrosRoutingModule { }
