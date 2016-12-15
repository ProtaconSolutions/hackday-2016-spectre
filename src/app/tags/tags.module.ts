import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TagsRoutingModule } from './tags-routing.module';
import { TagsComponent } from './tags.component';

@NgModule({
  imports: [
    SharedModule,
    TagsRoutingModule,
  ],
  declarations: [
    TagsComponent,
  ],
  exports: [
    TagsComponent,
  ],
})

export class TagsModule { }
