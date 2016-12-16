import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { overviewComponent } from "./overview.component";
import { AuthenticationGuard } from '../shared';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'overview',
        component: overviewComponent,
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

export class overviewRoutingModule { }
