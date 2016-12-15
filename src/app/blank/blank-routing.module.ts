import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BlankComponent } from './index';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'blank',
        component: BlankComponent,
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
})

export class BlankRoutingModule { }
