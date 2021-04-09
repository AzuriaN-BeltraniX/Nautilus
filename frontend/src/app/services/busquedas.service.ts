import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DataLocalService } from './dataLocal.service';

// Declarando el url para las peticiones:
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(
    private http: HttpClient,
    private dataLocalService: DataLocalService,
  ) { dataLocalService.cargarToken(); }

  // Función para buscar usuarios por el nombre de registro:
  busqueda_Coleccion(busqueda: string, coleccion: 'users' | 'doctores' | 'pacientes') {
    /** PRUEBA: Imprime en consola la acción que se está realizando. */
    console.log(`>>> Buscando elementos que concidan con: ${busqueda}`);

    // Requiere de los siguientes datos para continuar.
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Si hay caracteres en el campo de búsqueda, realiza la siguiente petición:
    return new Promise (resolve => {
      this.http.get(`${baseUrl}/search/collection/${coleccion}/${busqueda}`, {headers}).subscribe(resp => {
        /** PRUEBA: Imprime en consola la respuesta de la petición. */
        // console.log(resp);

        // Si la respuesta es correcta, entonces envía los resultados:
        if (resp['ok'] === true) {
          resolve(resp['resultados']);
        };
      }, (err => {
        return;
      }));
    });
  };
  
}
