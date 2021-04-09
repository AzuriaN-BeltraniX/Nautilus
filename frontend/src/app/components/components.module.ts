import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountPopoverComponent } from './account-popover/account-popover.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';

import { PerfilPageRoutingModule } from '../pages/dashboard/perfil/perfil-routing.module';
import { UserImageComponent } from './user-image/user-image.component';

@NgModule({
  declarations: [
    AccountPopoverComponent,
    HeaderComponent,
    MenuComponent,
    UserImageComponent,
  ],
  exports: [
    AccountPopoverComponent,
    PerfilPageRoutingModule,
    HeaderComponent,
    MenuComponent,
    UserImageComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }
