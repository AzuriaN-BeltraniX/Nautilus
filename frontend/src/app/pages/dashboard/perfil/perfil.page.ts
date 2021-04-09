import { Component } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalController } from '@ionic/angular';
import { UserImageComponent } from '../../../components/user-image/user-image.component';

import { DataLocalService } from '../../../services/dataLocal.service';
import { UsuarioService } from '../../../services/usuario.service';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';

declare var window: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage{

  // Declarando variables para su reutilización:
  public baseUrl: string = environment.baseUrl
  public noImage: string = 'noImage.svg';
  public offlineImage: string = '../../../../assets/images/img_avatar.png'

  public testImage: string = '';

  // Declarando el formulario para las peticiones:
  public userData = this.formBuilder.group({
    nombre: [this.dataLocalService.usuario.nombre, [Validators.required, Validators.minLength(3)]],
    email: [this.dataLocalService.usuario.email, [Validators.required, Validators.email]]
  });

  constructor(
    public dataLocalService: DataLocalService,
    private usuarioService: UsuarioService,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private modalController: ModalController,
  ) {}

  // Función que despliega opciones para cambiar la imagen
  async changeImg() {
    /** PRUEBA: Imprime en consola un mensaje de funcionamiento exitoso.  */
    console.log('Cambiar Imagen');

    const actionSheet = await this.actionSheetController.create({
      header: 'Cambia la imagen de tu perfil',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Tomar foto',
        icon: 'camera-outline',
        handler: () => {
          console.log('Camara en función');

          this.abrirCamara();
        }
      }, {
        text: 'Galería',
        icon: 'image-outline',
        handler: () => {
          console.log('Galería abierta');

          this.abrirGalería();
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancelado');
        }
      }]
    });
    await actionSheet.present();
    
  };

  async actualizarDatos() {
    /** PRUEBA: Imprime los datos del formulario. */
    console.log(this.userData.value);

    // Valida si los campos son correctos, si no lo son, entonces:
    if (this.userData.invalid) {
      // ... presenta una alerta en pantalla con un mensaje de éxito
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: `¡Hey!`,
        message: 'Asegúrate de haber completado todos los campos.',
        buttons: ['ok']
      });
      // ... presenta el mensaje creado,
      await alert.present();
    }

    // Intenta actualizar el perfil:
    await this.usuarioService.actualizarPerfil(this.userData.value).then(async resp => {
      /** PRUEBA: Imprime en consola la respuesta de la petición. */
      console.log(resp);

        // ... Si la respuesta el "true", entonces:
        if (resp['ok'] === true) {
          // ... presenta una alerta en pantalla con un mensaje de éxito
          const alert = await this.alertController.create({
            backdropDismiss: false,
            header: `¡Perfecto!`,
            message: 'Se ha actualizado correctamente tu información.',
            buttons: ['ok']
          });
          // ... presenta el mensaje creado,
          await alert.present();

          // ... actualiza el nuevo TOKEN y los datos de usuario en el Local Storage,
          this.dataLocalService.guardarToken(resp['token']);
          this.usuarioService.getUserData(resp['token']).then(resp => {          
            this.dataLocalService.guardarUsuario(resp['user']);
          });
        } else {
          // ... presenta una alerta en pantalla con un mensaje de éxito
          const alert = await this.alertController.create({
            backdropDismiss: false,
            header: resp['header'],
            message: resp['msg'],
            buttons: ['ok']
          });
          // ... presenta el mensaje creado,
          await alert.present();
        };
    });
  };

  // Función para abrir el modal donde se muestra la imagen seleccionada para actualización de foto de perfil:
  async userImages_modal(dirFile: string) {
    /** PRUEBA: Imprime mensaje de funcionamiento correcto */
    console.log('Modal Abierto');

    const modal = await this.modalController.create({
      component: UserImageComponent,
      cssClass: 'my-custom-class',
      componentProps: {imgDir: dirFile}
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
      this.userImages_modal(imageData);
     }, (err) => {
      // Si ha ocurrido un error, imprime en consola el error generado:
      console.log(err);
     });
  };

  // Función solo para dispositivos en la que se ejecuta la cámara:
  abrirCamara() {
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
  abrirGalería() {
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
