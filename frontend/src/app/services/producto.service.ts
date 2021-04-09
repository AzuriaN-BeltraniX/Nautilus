import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DataLocalService } from './dataLocal.service';

// Declarando el url para las peticiones:
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    private http: HttpClient,
    private dataLocalService: DataLocalService,
  ) { }

  // Función para obtener los productos registrados:
  obtenerProductos(desde: number) {
    /** PRUEBA: Imprime en consola mensaje de la acción a realizar. */
    console.log('>>> Listando productos...');
    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Promesa...
    return new Promise(resolve => {
      // Realiza la petición y ejecuta las siguientes acciones:
      this.http.get(`${baseUrl}/productos?desde=${desde}`, {headers}).subscribe(resp => {
        if (resp['ok'] === true) {
          /** PRUEBA: Imrpime en consola mensaje de éxito. */
          console.log('>>> Productos listados');
          
          resolve({
            total: resp['total'],
            productos: resp['productos']
          }); 
        };
      }, (err) => {
        resolve(err);
      });
    });
  };

}
