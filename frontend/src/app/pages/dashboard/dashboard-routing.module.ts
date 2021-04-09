import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children:[
      { path: '', redirectTo: '/dashboard/inicio', pathMatch: 'full'},
      // Menú General:
      {
        path: 'inicio',
        loadChildren: () => import('../dashboard/inicio/inicio.module').then( m => m.InicioPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../dashboard/perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      // Menú administradores:
      {
        path: 'usuarios',
        loadChildren: () => import('./mantenimientos/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
      },
      {
        path: 'medicos',
        loadChildren: () => import('./mantenimientos/medicos/medicos.module').then( m => m.MedicosPageModule)
      },
      {
        path: 'pacientes',
        loadChildren: () => import('./mantenimientos/pacientes/pacientes.module').then( m => m.PacientesPageModule)
      },
      {
        path: 'almacenes',
        loadChildren: () => import('./pos/almacenes/almacenes.module').then( m => m.AlmacenesPageModule)
      },
      {
        path: 'productos',
        loadChildren: () => import('./pos/productos/productos.module').then( m => m.ProductosPageModule)
      },
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardPageRoutingModule {}
