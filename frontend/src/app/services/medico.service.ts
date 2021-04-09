import { Injectable, OnInit } from '@angular/core';
import { DataLocalService } from './dataLocal.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// Declarando el url para las peticiones:
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class MedicoService implements OnInit {

  constructor(
    private http: HttpClient,
    private dataLocalService: DataLocalService
  ) { }

  async ngOnInit() {
    // Carga el token del Local Storage:
    await this.dataLocalService.cargarToken();
  }

  // Función para crear un médico
  crearMedico(data) {
    /** PRUEBA: Imprime en consola mensaje de la acción a realizar. */
    console.log('>>> Registrando a un nuevo médico...');

    // Require de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Promesa...
    return new Promise (resolve => {
      this.http.post(`${baseUrl}/doctores`, data, {headers}).subscribe(resp => {
        /** PRUEBA: Imprime en consola la respuesta de la petición. */
        console.log(resp);
        
        // Si la respuesta muestra "true", entonces filtra la respuesta y muestra los datos del médico creado:
        if (resp['ok'] === true) {
          /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
          console.log('>>> Medico registrado.');
          resolve(resp['doctor']);
        };
      }, (err) => {
        /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
        console.log('>>> No fue posible registrar al médico.');
        // Si no se pudo realizar la busqueda, entonces retorna el error.
        resolve(err);
      });
    });
  };

  // Función para obtener una lista de los médicos registrados:
  obtenerMedicos(desde: number) {
    /** PRUEBA: Imprime en consola mensaje de la acción a realizar. */
    console.log('>>> Obteniendo a los médicos registrados...');

    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Promesa...
    return new Promise (resolve => {
      this.http.get(`${baseUrl}/doctores?desde=${desde}`, {headers}).subscribe(resp => {
        /** PRUEBA: Imprime la respuesta de la petición. */
        console.log(resp);

        // Si la respuesta muestra "true", entonces filtra los médicos de la respuesta
        if (resp['ok'] === true) {
          resolve(resp);
          /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
          console.log('>>> Médicos listados.');
        };
      }, (err) => {
        // Si no se pudo realizar la busqueda, entonces retorna el error.
        resolve(err);
      });
    });
  };

  // Función para actualizar los datos de un médico registrado:
  actualizaMedico(data, id: string) {
    /** PRUEBA: Imprime en consola mensaje de la acción a realizar. */
    console.log('>>> Actualizando al médico...');

    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Promesa...
    return new Promise (resolve => {
      this.http.put(`${baseUrl}/doctores/${id}`, data, {headers}).subscribe(resp => {
        /** PRUEBA: Imprime en consola la respuesta de la petición. */
        console.log(resp);
        
        // Si la respuesta muestra "true", entonces filtra la respuesta y muestra los siguientes elementos
        if (resp['ok'] === true) {
          resolve({
            header: resp['header'],
            data: resp['data']
          });

          /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
          console.log('>>> Médico actualizado.');
        }
      }, (err) => {
        resolve(err);
      });
    });
  };

  // Función para eliminar a un médico mediante su ID:
  eliminaMédico(id: string) {
    /** PRUEBA: Imprime en consola mensaje de la acción a realizar. */
    console.log('>>> Eliminando médico...');

    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Promesa...
    return new Promise (resolve => {
      this.http.delete(`${baseUrl}/doctores/${id}`, {headers}).subscribe(resp => {
        /** PRUEBA: Imprime la respuesta de la petición. */
        console.log(resp);
        
        // Si la respuesta muestra "true", entonces filtra la respuesta y muestra los siguientes elementos
        if (resp['ok'] === true) {
          resolve({
            header: resp['header'],
            msg: resp['msg'],
            doctorName: resp['doctorName'],
            cedulaProf: resp['doctorName'],
            doctorId: resp['doctorId']
          });
        };
      }, (err) => {
        // Si no se pudo realizar la busqueda, entonces retorna el error.
        resolve(err);
      });
    });
  };

}
