import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TagsComponent } from './index';
import { AuthenticationGuard } from '../shared';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'tags',
        component: TagsComponent,
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

export class TagsRoutingModule { }
