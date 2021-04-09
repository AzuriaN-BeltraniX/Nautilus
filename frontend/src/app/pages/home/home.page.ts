import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { DataLocalService } from '../../services/dataLocal.service';
import { Router } from '@angular/router';

declare var window: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // Declarando variables para su retilización:
  public validSession: boolean = true;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private usuarioService: UsuarioService,
    private dataLocalService: DataLocalService
  ) { 
    // Ejecuta la validación de sesión existente:
    this.existeToken(); 
  }

  // Función para comprobar una sesión activa:
  existeToken() {
    // Carga el token desde el Local Storage:
    this.dataLocalService.cargarToken_Promise().then(async result => {
      /** PRUEBA: Imprime el booleano retornado de la promesa. */
      console.log('> ¿Existen un token?:', result);

      // Si el valor de retorno es 'true', entonces valida el token enviando una petición backend, si no indica al usuario que debe de iniciar sesión:
      if (result === true) {
        await this.usuarioService.validarToken().then(resp => {
          /** PRUEBA: Imprime la respuesta de la petición. */
          console.log('> ¿Es válido el token?:', resp);
    
          // ... Si la respuesta es "true", entonces dirige al dashboard, si no, pide al usuario que inicie sesión
          if (resp === true) {
            this.router.navigateByUrl('/dashboard');
            setTimeout(() => {
              this.validSession = false;
            }, 3000);
          } else {
            this.validSession = false;
          };
        });
      } else {
        this.validSession = false;
      };
    });
  };

  // Función para mostrar una alerta si es que el usuario se está registrando
  async register() {
    /** PRUEBA: Imprime mensaje de acción. */
    console.log('Funciona Register');

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: '¡Hola!',
      subHeader: 'Bienvenido a Nautilus.',
      message: 'Recuerda leer los términos y condiciones, y usar una contraseña con un mínimo de 8 carácteres.',
      buttons: ['Adelante']
    });

    await alert.present();

  }

}
