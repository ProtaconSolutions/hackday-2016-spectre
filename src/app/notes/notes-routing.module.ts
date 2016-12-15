import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NotesComponent } from "./notes.component";
import { AuthenticationGuard } from '../shared';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'notes',
        component: NotesComponent,
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

export class NotesRoutingModule { }
