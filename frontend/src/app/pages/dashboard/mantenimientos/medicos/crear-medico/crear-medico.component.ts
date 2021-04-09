import { Component, OnInit, Output } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { MedicoService } from '../../../../../services/medico.service';
import { Medico } from 'src/app/models/medico.model';

@Component({
  selector: 'app-crear-medico',
  templateUrl: './crear-medico.component.html',
  styleUrls: ['./crear-medico.component.scss'],
})
export class CrearMedicoComponent implements OnInit {

  @Output() doctorData: Medico;

  // Declarando variables para su reutilización:

  // Declarando el formulario para su envío:
  public doctorRegister = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    cedulaProf: ['', [Validators.required, Validators.minLength(9)]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController,
    private medicoService: MedicoService
  ) { }

  ngOnInit() {}

  // Función que cierra el modal:
  async cerrarModal(){
    // ... Si el usuario decide cancelar el procedimiento, muestra una alerta,
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: `¡Hey!`,
      message: 'No se han guardado los cambios. ¿Quieres continuar?.',
      buttons: [
        {
          text: 'Sí',
          cssClass: 'confirm',
          handler: () => {
            this.modalController.dismiss({
              'dismissed': true
            });
          }
        },
        {
          text: 'No',
          cssClass: 'cancel'
        }
      ]
    });
    // ... presenta el mensaje creado
    await alert.present();
  };

  // Función para enviar los datos del formulario para crear un médico:
  crearMedico() {
    /** PRUEBA: Imprime en consola mensaje de funcionamiento. */
    console.log('>>! Funciona crear médico...');
    /** PRUEBA: Imprime en consola los valores obtenidos del formulario. */
    console.log(this.doctorRegister.value);

    // Realiza la petición:
    this.medicoService.crearMedico(this.doctorRegister.value).then(async (result: any) => {
      /** PRUEBA: Imprime en consola los datos del nuevo doctor. */
      console.log(result);

      // Si existe la id del nuevo doctor en la respuesta, entonces cierra el modal,
      if (result._id) {
        this.modalController.dismiss({
          itemReturned: true
        });

        // ... y muestra mensaje de éxito en pantalla:
        const toast = await this.toastController.create({
          header: '¡Médico registrado exitosamente',
          position: 'bottom'
        });
        toast.present();
        // ... cierra la alerta en 2.5 segundos:
        setTimeout(() => {
          this.toastController.dismiss();
        }, 5000);
      } else {
        // ... Si la respuesta no es correcta, entonces muestra una alerta:
        const alert = await this.alertController.create({
          backdropDismiss: false,
          header: result.error.header,
          message: result.error.msg,
          buttons: ['ok']
        });
        // ... presenta el mensaje creado
        await alert.present();
      }
    });
  }; 

}
