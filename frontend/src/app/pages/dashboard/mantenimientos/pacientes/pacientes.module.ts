import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PacientesPageRoutingModule } from './pacientes-routing.module';

import { PacientesPage } from './pacientes.page';
import { EditarCrearComponent } from './editar-crear/editar-crear.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PacientesPageRoutingModule
  ],
  declarations: [
    PacientesPage,
    EditarCrearComponent
  ]
})
export class PacientesPageModule {}
