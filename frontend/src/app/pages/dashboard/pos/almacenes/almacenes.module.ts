import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlmacenesPageRoutingModule } from './almacenes-routing.module';

import { AlmacenesPage } from './almacenes.page';
import { AlmacenComponent } from './almacen/almacen.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AlmacenesPageRoutingModule
  ],
  declarations: [
    AlmacenComponent,
    AlmacenesPage
  ]
})
export class AlmacenesPageModule {}
