import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlmacenesPage } from './almacenes.page';

const routes: Routes = [
  {
    path: '',
    component: AlmacenesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlmacenesPageRoutingModule {}
