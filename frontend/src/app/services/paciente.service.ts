import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { DataLocalService } from './dataLocal.service';

// Declarando el url para las peticiones:
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class PacienteService implements OnInit {

  constructor(
    private http: HttpClient,
    private dataLocalService: DataLocalService
  ) { }

  async ngOnInit() {
    // Carga el token del Local Storage:
    await this.dataLocalService.cargarToken();
  }

  // Función para crear a un paciente:
  crearPaciente(data) {
    /** PRUEBA: Imprime en consola mensaje de la acción a realizar. */
    console.log('>>> Registrando a un nuevo paciente...');

    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });
    
    // Promesa...
    return new Promise (resolve => {
      this.http.post(`${baseUrl}/pacientes`, data, {headers}).subscribe(resp => {
        /** PRUEBA: Imprime en consola la respuesta de la petición. */
        console.log(resp);
        
        // Si la respuesta muestra "true", entonces filtra lo siguiente:
        if (resp['ok'] === true) {
          resolve(resp['paciente']);
        };
        /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
        console.log('>>> Paciente registrado.');
      }, (err) => {
        // Si no se pudo realizar la busqueda, entonces retorna el error.
        resolve(err);

        /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
        console.log('>>> No se pudo crear al paciente.');
      });
    });
  };

  // Función para obtener una lista de los pacientes registrados:
  obtenerPacientes(desde: number) {
    /** PRUEBA: Imprime en consola mensaje de la acción a realizar. */
    console.log('>>> Obteniendo a los pacientes registrados...');

    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Promesa:
    return new Promise (resolve => {
      this.http.get(`${baseUrl}/pacientes?desde=${desde}`, {headers}).subscribe(resp => {
        /** PRUEBA: Imprime la respuesta de la petición. */
        console.log(resp);
        
        // Si la respuesta es correcta, entonces filtra lo siguiente:
        if (resp['ok'] === true) {
          resolve({
            total: resp['total'],
            pacientes: resp['pacientes']
          });

          /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
          console.log('>>> Pacientes listados.');
        };
      }, (err) => {
        // Si no se pudo realizar la busqueda, entonces retorna el error.
        resolve(err);

        /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
        console.log('>>> No se pudo listar a los pacientes.');
      });
    });
  };

  // Función para actualizar a un paciente:
  actualizarPaciente(data, id: string) {
    /** PRUEBA: Imprime en consola mensaje de la acción a realizar. */
    console.log('>>> Actualizando al paciente seleccionado...');

    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Promesa:
    return new Promise (resolve => {
      this.http.put(`${baseUrl}/pacientes/${id}`, data, {headers}).subscribe(resp => {
        /** PRUEBA: Imrpime en consola la respuesta de la petición. */
        console.log(resp);
        
        // Si la respuesta es correcta, entonces filtra lo siguiente:
        if (resp['ok'] === true) {
          resolve({
            msg: resp['msg'],
            data: resp['data']
          });

          /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
          console.log('>>> Paciente seleccionado actualizado.');
        };
      }, (err) => {
        // Si no se pudo realizar la busqueda, entonces retorna el error.
        resolve(err);

        /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
        console.log('>>> No se pudo actualizar al paciente.');
      });
    });
  };

  // Función para eliminar a un paciente seleccionado:
  eliminarPaciente(id: string) {
    /** PRUEBA: Imprime en consola mensaje de la acción a realizar. */
    console.log('>>> Eliminando al paciente seleccionado...');    
    
    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Promesa:
    return new Promise (resolve => {
      this.http.delete(`${baseUrl}/pacientes/${id}`, {headers}).subscribe(resp => {
        /** PRUEBA: Imprime en consola la respuesta de la petición. */
        console.log(resp);

        // Si la respuesta es correcta, entonces filtra lo siguiente:
        if (resp['ok'] === true) {
          resolve({
            header: resp['header'],
            msg: resp['msg'],
            nombrePaciente: resp['nombrePaciente'],
            idPaciente: resp['idPaciente']
          });          
          
          /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
          console.log('>>> Paciente eliminado.');
        };
      }, (err) => {        
        // Si no se pudo realizar la busqueda, entonces retorna el error.
        resolve(err);

        /** PRUEBA: Imprime en consola mensaje de la acción realizada. */
        console.log('>>> No se pudo eliminar al paciente.');});
    });
  };

}
