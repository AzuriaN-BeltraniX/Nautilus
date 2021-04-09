import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Usuario } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  // Declarando variables para su reutilización:
  usuario: Usuario;
  token: string = null;
  imageUrl: string = '';
  public menu: any;

  constructor(private storage: Storage) { 
    this.cargarUsuario();
  }

  // Proceso para almacenar el token en el Local Storage:
  async guardarToken(token: string) {
    this.token = token;
    await this.storage.set('token', token);

    /** PRUEBA: Imprime en consola el 'Token' almacenado. */
    // console.log(`Token almacenado: \n ${token}`);
  };

  // Proceso para varificar la existencia de un token retornando un boobleano:
  async cargarToken_Promise() {
    const token = await this.storage.get('token');
    // console.log('Token:', token);
    
    return new Promise (resolve => {
      if (token === null) {
        resolve(false);
      } else {
        resolve(true);
      };
    });
  };

  // Proceso para cargar el token del Local Storage:
  async cargarToken() {
    this.token = await this.storage.get('token') || null;

    /** PRUEBA: Imprime en consola el 'Token' cargado. */
    // console.log(`Token cargado: \n ${this.token}`);
  };

  // Proceso para eliminar el token del Local Storage:
  async eliminarToken() {
    await this.storage.remove('token');
  };

  // Proceso para almacenar el usuario en sesión en el Local Storage:
  async guardarUsuario(usuario: Usuario) {
    this.usuario = usuario;
    await this.storage.set('usuario', usuario);

    /** PRUEBA: Imprime en consola el 'Usuario' almacenado. */
    // console.log('Usuario almacenado:', usuario);
  };

  // Proceso para varificar la existencia de un token retornando un boobleano:
  async cargarUsuario_Promise() {
    const usuario = await this.storage.get('usuario')
    // console.log('Usuario:', usuario);

    return new Promise (resolve => {
      if (usuario === null) {
        resolve(false);
      } else {
        resolve(true);
      };
    });
  };

  // Proceso para cargar el token del Local Storage:
  async cargarUsuario() {
    this.usuario = await this.storage.get('usuario');

    /** PRUEBA: Imprime en consola el 'Usuario' cargado. */
    // console.log('Usuario cargado: ', this.usuario || 'No hay datos aún.');
  };

  // Proceso para almacenar temporalmente la imagen seleccionada de perfil:
  async guardarNuevaImagenTmp_Usuario(imageUrl: string) {
    this.imageUrl = imageUrl;
    await this.storage.set('imageUrl', imageUrl);

    /** PRUEBA: Imprime en consola la url de imagen almacenada temporalmente. */
    console.log('URL almacenado:', imageUrl);
  };

  // Proceso para cargar la imagen seleccionada de perfil:
  async cargarNuevaImagenTmp_Usuario() {
    this.imageUrl = await this.storage.get('imageUrl');

    /** PRUEBA: Imprime en consola la URL de imagen cargada. */
    console.log(`URL cargado: \n ${this.imageUrl}`);
  };

  // Proceso para eliminar la imagen temporal seleccionada:
  async eliminarNuevaImagenTmp_Usuario() {
    await this.storage.remove('imageUrl');

    /** PRUEBA: Imprime en consola mensaje de éxito. */
    console.log('Imagen temporal eliminada del LocalStorage');
  };

  // Proceso para almacenar el menú del dashboard proveniente del login:
  async guardarMenu(menu) {
    await this.storage.set('menu', JSON.stringify(menu));
  };

  // Función para cargar el menú del Local Storage:
  async cargarMenu() {
    this.menu = JSON.parse(await this.storage.get('menu'));
  };

  // Función para eliminar el menú almacenado del Local Storage:
  async eliminarMenu() {
    this.menu = [];
    this.storage.remove('menu');
  };

}