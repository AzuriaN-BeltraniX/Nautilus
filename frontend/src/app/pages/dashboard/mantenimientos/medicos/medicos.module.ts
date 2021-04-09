import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicosPageRoutingModule } from './medicos-routing.module';

import { MedicosPage } from './medicos.page';
import { ComponentsModule } from '../../../../components/components.module';
import { EditarMedicoComponent } from './editar-medico/editar-medico.component';
import { CrearMedicoComponent } from './crear-medico/crear-medico.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MedicosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [
    MedicosPage,
    EditarMedicoComponent,
    CrearMedicoComponent
  ]
})
export class MedicosPageModule {}
