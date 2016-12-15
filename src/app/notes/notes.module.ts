import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { NotesRoutingModule } from './notes-routing.module';
import { NotesComponent } from './notes.component';

@NgModule({
  imports: [
    SharedModule,
    NotesRoutingModule,
  ],
  declarations: [
    NotesComponent,
  ],
  exports: [
    NotesComponent,
  ],
})

export class NotesModule { }
