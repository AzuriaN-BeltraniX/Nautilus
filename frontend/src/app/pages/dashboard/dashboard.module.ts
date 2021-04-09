import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { IonicModule } from '@ionic/angular';

import { DashboardPage } from './dashboard.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
