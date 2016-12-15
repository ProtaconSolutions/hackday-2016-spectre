import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SidenavComponent } from './index';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SidenavComponent,
        outlet: 'sidenav',
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
})

export class SidenavRoutingModule { }
