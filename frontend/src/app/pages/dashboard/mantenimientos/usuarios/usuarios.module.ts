import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosPageRoutingModule } from './usuarios-routing.module';

import { UsuariosPage } from './usuarios.page';
import { EditarUsuarioComponent } from '../usuarios/editar-usuario/editar-usuario.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UsuariosPageRoutingModule
  ],
  declarations: [
    EditarUsuarioComponent,
    UsuariosPage
  ]
})
export class UsuariosPageModule {}
