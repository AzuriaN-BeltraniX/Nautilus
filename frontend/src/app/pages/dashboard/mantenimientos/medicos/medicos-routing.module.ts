import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicosPage } from './medicos.page';

const routes: Routes = [
  {
    path: '',
    component: MedicosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicosPageRoutingModule {}
