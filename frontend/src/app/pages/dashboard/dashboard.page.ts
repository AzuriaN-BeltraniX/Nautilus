import { Component, OnInit } from '@angular/core';

import { DataLocalService } from '../../services/dataLocal.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  // Declarando variables para su reutulización:
  public menu: [] = [];

  constructor(
    public dataLocalService: DataLocalService
  ) {}

  async ngOnInit() {
    // Carga el menú del localStorageService y almacena la carga en el arreglo "menu";
    await this.dataLocalService.cargarMenu();
    /** PRUEBA: Imprime en consola el menú cargado desde el Local Storage. */
    console.log('Menú cargado desde el Local Storage:', this.dataLocalService.menu);

    this.menu = this.dataLocalService.menu;
  }

}
