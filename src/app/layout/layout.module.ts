import { NgModule } from '@angular/core';

import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { SidenavModule } from './sidenav/sidenav.module';

@NgModule({
  imports: [
    FooterModule,
    HeaderModule,
    SidenavModule,
  ],
  exports: [
    FooterModule,
    HeaderModule,
    SidenavModule,
  ],
})

export class LayoutModule { }
