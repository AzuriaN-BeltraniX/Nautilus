import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DataLocalService } from './dataLocal.service';

// Declarando el url para las peticiones:
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  constructor(
    private http: HttpClient,
    private dataLocalService: DataLocalService,
  ) { }

  // Función para registrar un nuevo almacén:
  crearAlmacen(data) {
    /** PRUEBA: Imprime en consola mensaje de la acción a realizar. */
    console.log('>>> Registrando un nuevo almacén...');

    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    return new Promise(resolve => {
      this.http.post(`${baseUrl}/almacenes`, data, {headers}).subscribe(resp => {
        /** PRUEBA: Imprime en consola la respuesta de la petición. */
        // console.log(resp);
        
        if (resp['ok'] === true) {
          /** PRUEBA: Imrpime en consola mensaje de éxito. */
          console.log('>>> Almacén registrado.');

          resolve({
            header: resp['header'],
            almacen: resp['almacen']
          });
        };
      }, (err) => {
        resolve(err);
      });
    });
  };

  // Función para obtener los almacenes registrados:
  obtenerAlmacenes(desde: number) {
    /** PRUEBA: Imprime en consola mensaje de la acción a realizar. */
    console.log('>>> Listando almacenes...');

    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Promesa...
    return new Promise(resolve => {
      // Realiza la petición y ejecuta las siguientes acciones:
      this.http.get(`${baseUrl}/almacenes?desde=${desde}`, {headers}).subscribe(resp => {
        if (resp['ok'] === true) {
          /** PRUEBA: Imrpime en consola mensaje de éxito. */
          console.log('>>> Almacenes listados');
          
          resolve({
            total: resp['total'],
            almacenes: resp['almacenes']
          }); 
        };
      }, (err) => {
        resolve(err);
      });
    });
    
  };

  // Función para actualizar los datos de un almacén registrado:
  actualizaAlmacen(data, id: string) {
    /** PRUEBA: Imprime en consola mensaje de la acción a realizar. */
    console.log('>>> Actualizando almacén...');

    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Promesa...
    return new Promise (resolve => {
      this.http.put(`${baseUrl}/almacenes/update/${id}`, data, {headers}).subscribe(resp => {
        /** PRUEBA: Imprime en consola la respuesta de la petición. */
        // console.log(resp);
        
        // Si la respuesta muestra "true", entonces filtra la respuesta y muestra los siguientes elementos
        if (resp['ok'] === true) {
          resolve({
            header: resp['header'],
            almacen: resp['almacen']
          });

          /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
          console.log('>>> Almacén actualizado.');
        }
      }, (err) => {
        resolve(err);
      });
    });
  };

  // Función para eliminar un almacén mediante su ID:
  eliminaAlmacen(id: string) {
    /** PRUEBA: Imprime en consola mensaje de la acción a realizar. */
    console.log('>>> Eliminando almacen...');

    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Promesa...
    return new Promise (resolve => {
      this.http.delete(`${baseUrl}/almacenes/${id}`, {headers}).subscribe(resp => {
        /** PRUEBA: Imprime la respuesta de la petición. */
        // console.log(resp);
        
        // Si la respuesta muestra "true", entonces filtra la respuesta y muestra los siguientes elementos
        if (resp['ok'] === true) {
          resolve( resp['header']);

          /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
          console.log('>>> Almacén eliminado.');
        };
      }, (err) => {
        // Si no se pudo realizar la busqueda, entonces retorna el error.
        resolve(err);
      });
    });
  };

}
