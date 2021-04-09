import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { DataLocalService } from "../../../services/dataLocal.service";

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  // Declarando variables para su reutlización:
  public nombre: any = '';

  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private dataLocalService: DataLocalService
  ) { }

  ngOnInit() {
    this.nombre = this.dataLocalService.usuario.nombre;
    this.nombre = this.nombre.split(' ');
    this.nombre = this.nombre[0];
  }

  // Función que registra cada que el usuario presiona el botón de retroceso:
  backButton_eventRegister() {    
    this.platform.backButton.subscribe(async () => {
      console.log('Boton');

      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: '¡Hola!',
        buttons: ['Adelante']
      });

      await alert.present();

    });
  };

}
