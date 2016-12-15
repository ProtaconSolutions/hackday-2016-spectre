import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { SidenavComponent } from './index';
import { SidenavRoutingModule } from './sidenav-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SidenavRoutingModule,
  ],
  declarations: [
    SidenavComponent,
  ],
  exports: [
    SidenavComponent,
  ],
})

export class SidenavModule { }
