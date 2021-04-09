import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

import { DataLocalService } from './dataLocal.service';
import { Usuario } from '../models/usuario.model';
import { RegisterForm, LoginForm, RespLogin } from '../interfaces/auth.interfaces';

// Declarando el url para las peticiones:
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Declarando variables para su reutilización:
  token: string = null;
  userData: Usuario;
  userImage = '';
  usuario: Usuario;
  menu: [] = [];

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private dataLocalService: DataLocalService,
    private navController: NavController
  ) { }

  // Función envia formulario post a backend para iniciar sesión y Guarda en localStorage data de usuario:
  login(formData: LoginForm) {
    /** PRUEBA: Imprime en consola un mensaje que afirma la ejecución de esta función. */
    // console.info(`¡UsuarioService.Login en función!`);
    
    // Envia por POST el formulario a url de backend,
    return new Promise(resolve => {
      this.http.post(`${baseUrl}/login`, formData).subscribe((resp: RespLogin) => {
        // ... valida la respuesta y ejecuta las siguientes acciones:
        if (resp.ok === true) {
          this.dataLocalService.guardarToken(resp.token);
          this.dataLocalService.guardarUsuario(resp.usuario);
          this.dataLocalService.guardarMenu(resp.menu);
          resolve(resp);          
        } else {
          this.token = null;
          this.storage.remove('token');
          this.storage.remove('usuario');
          resolve(resp);
        }
      }, (err) => {
        resolve(err.error);
      });
    });
  };

  // Función que valida el TOKEN obtenido de un inicio de sesión exitoso para enviarlo al AuthGuard:
  async validarToken(): Promise<boolean> {
    // Requiere el Token del Local Storage para continuar:
    await this.dataLocalService.cargarToken();
    // ... si no se pudo cargar o no existe el Token, entonces retorna "false":
    if (!this.dataLocalService.token) {
      this.navController.navigateRoot('/home');
      return Promise.resolve(false);
    };

    return new Promise<boolean> (resolve => {
      // Prepara los datos necesarios para realizar la petición:
      const headers = new HttpHeaders({
        'x-token': this.dataLocalService.token
      });

      // Realizando la petición;
      this.http.get(`${baseUrl}/login/validUser`, {headers}).subscribe((resp: any) => {
        
        // ... Si en la respuesta existe "true", entonces,
        if (resp.ok === true) {
          this.usuario = resp.user;
          resolve(true);
        } else {
          this.navController.navigateRoot('/home');
          resolve(false);
        };
      });
    });
  };

  // Función para registrar un nuevo usuario:
  crearUsuario(formData: RegisterForm) {
    /* Pruebas: Imprime mensaje de lo que está pasando. */
    console.log('Creando Usuario...');

    // Promesa...
    return new Promise(resolve => {
      // ... Realiza la petición:
      this.http.post(`${baseUrl}/users`, formData).subscribe((resp: RespLogin) => {
        // ... valida la respuesta y ejecuta las siguientes acciones:
        if (resp.ok === true) {
          this.dataLocalService.guardarToken(resp.token);
          this.dataLocalService.guardarUsuario(resp.usuario);
          resolve(resp);
        };
      }, (err) => {
        resolve(err.error);
      });
    });
  };

  // Función para actualizar la información del usuario en sesión:
  actualizarPerfil(data: userData) {
    // Requiere de los siguientes datos para continuar:
    const userID = this.dataLocalService.usuario.userID
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    return new Promise(resolve => {
      // Realizando la petición:
      this.http.put(`${baseUrl}/users/update/${userID}`, data, {headers}).subscribe(resp => {
        if (resp['ok'] === true) {
          resolve(resp);
        } else {
          resolve(resp)
        }
      }, (err) => {
        resolve(err.error)
      });
    });
  };

  // Función para actualizar la información de un usuario externo
  actualizarPerfil_ext(data, id) {
    // Requiere de los siguientes datos para continuar:
    const userID = id;
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Realizando la petición:
    return new Promise(resolve => {
      this.http.put(`${baseUrl}/users/${userID}`, data, {headers}).subscribe(resp => {
        
        if (resp['ok'] === true) {
          resolve(resp['usuario']);
        };
      }, (err) => {
        resolve(err);
      });
    });
    
  };

  // Función que obtiene los datos de usuario cargados desde el TOKEN:
  getUserData(token: string) {
    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': token
    });

    // Realizando la petición:
    return new Promise(resolve => {
      this.http.get(`${baseUrl}/login/validUser`, {headers}).subscribe(resp => {
        if (resp['ok'] === true) {
          resolve({
            header: resp['header'],
            msg: resp['msg']
          })
        };
      });
    });
  };

  // Función para obtener los datos de los usuarios registrados:
  obtenerUsuarios(desde: number) {
    /** PRUEBA: Imprime en consola la acción que se está realizando. */
    console.log('Listando usuarios...');

    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });    
    
    return new Promise (resolve => {
      this.http.get(`${baseUrl}/users?desde=${desde}`, {headers}).subscribe(resp => {
        /** PRUEBA: Imprime la respuesta de la petición. */
        console.log(resp);

        if(resp['ok'] === true) {
          resolve(resp);
          console.log('Usuarios listados');
        };
      }, (err) => {
        console.error(err);
      });
    });
  };

  // Función para eliminar un usuario seleccionado
  eliminarUsuario(id: string) {
    /** PRUEBA: Imprime en consola la acción que se está realizando. */
    console.log('Eliminando usuario...');

    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'x-token': this.dataLocalService.token
    });

    // Realizando la petición...
    return new Promise (resolve => {
      this.http.delete(`${baseUrl}/users/${id}`, {headers}).subscribe(resp => {
        /** PRUEBA: Imprime en consola la respuesta de la petición: */
        console.log(resp);

        // Si la petición demuestra una respuesta exitosa, entonces devuelve la respuesta de la petición:
        if (resp['ok'] === true) {
          resolve(resp);
          console.log('Usuario eliminado');
        };
      }, (err) => {
        resolve(err);
      });
    });
  };
    
  // Función que construye el URL para visualizar imágenes en la interfaz de usuario:
  getUserImage() {
    if (!this.dataLocalService.usuario.img) {
      return `../../assets/images/img_avatar.png`;
    } else {
      return `${baseUrl}/upload/users/${this.dataLocalService.usuario.img}`;
    };
  };

}

// Interface para actualizar el perfil de usuario:
interface userData {
  userName: string;
  email: string;
}