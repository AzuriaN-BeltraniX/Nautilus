import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalController } from '@ionic/angular';

import { DataLocalService } from './dataLocal.service';
import { UserImageComponent } from '../components/user-image/user-image.component';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class HardwarecontrollerService {

  // Declarando variables para su reutilización:
  public testImage: string = '';

  constructor(
    private camera: Camera,
    private modalController: ModalController,
    private dataLocalService: DataLocalService
  ) { }

  // Función para abrir el modal donde se muestra la imagen seleccionada para actualización de foto de perfil:
  async userImages_modal() {
    /** PRUEBA: Imprime mensaje de funcionamiento correcto */
    console.log('Modal Abierto');

    const modal = await this.modalController.create({
      component: UserImageComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  };

  // Configuración de la cámara:
  imgConfig(options: CameraOptions) {
    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData);

      const img = window.Ionic.WebView.convertFileSrc(imageData);
      /** PRUEBA: Imprime en consola el URL asignado a la foto rescatada: */
      console.log(img);

      // Carga la imagen en la tarjeta y almacena el URL temporalmente en el Local Storage:
      this.testImage = img;
      this.dataLocalService.guardarNuevaImagenTmp_Usuario(img);
      this.userImages_modal();
      }, (err) => {
      // Si ha ocurrido un error, imprime en consola el error generado:
      console.log(err);
      });
  };

  // Función solo para dispositivos en la que se ejecuta la cámara:
  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    this.imgConfig(options);
  };

  // Función solo para dispositivos en la que se abre la galería:
  openGalery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.imgConfig(options);
  };
  
}
