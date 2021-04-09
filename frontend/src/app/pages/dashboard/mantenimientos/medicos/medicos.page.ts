import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList, ModalController, IonInfiniteScroll } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from '../../../../services/medico.service';
import { BusquedasService } from '../../../../services/busquedas.service';
import { EditarMedicoComponent } from './editar-medico/editar-medico.component';
import { CrearMedicoComponent } from './crear-medico/crear-medico.component';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.page.html',
  styleUrls: ['./medicos.page.scss'],
})
export class MedicosPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonList) ionList: IonList;

  // Declarando variables para su reutilización:
  public baseUrl: string = environment.baseUrl
  public noImage: string = 'noImage.svg';

  public medicos: Medico[] = [];
  public totalRegistrados: number = 0;
  public updateList: boolean = true;
  public loading: boolean = true;
  public loaderText_Card: string = '';
  public completeListener: boolean = false;
  public listenerText: string = '';
  private desde: number = 0;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private medicoService: MedicoService,
    private busquedasService: BusquedasService
  ) { }

  ngOnInit() {
    // Captura a los médicos y muéstralos en pantalla:
    this.obtenerMedicos();
  }

  // Función para crear un médico:
  async crearMedico() {
    /** PRUEBA: Imprime en consola mensaje de funcionamiento. */
    console.log('>>! Funciona crear médico...');
    
    // Abre el modal para registrar a un nuevo médico:
    const modal = await this.modalController.create({
      component: CrearMedicoComponent,
      cssClass: 'my-custom-class'
    });
    await modal.present(); 
    // ... una vez abierto, cierra el sliding.
    this.ionList.closeSlidingItems();

    // Al cerrar el modal, recibe los datos del medico actualizado:
    const { data } = await modal.onDidDismiss();
    /** PRUEBA: Imprime en consola los datos recibidos. */
    console.log(data);

    // Si existen datos recibidos entonces ejecuta las siguientes acciones:
    if (data.itemReturned === true) {
      this.desde = 0
      this.medicos = [];
      this.completeListener = false;
      this.infiniteScroll.disabled = false;

      this.obtenerMedicos();
    };
  };

  // Función para obtener una lista de los médicos registrados:
  async obtenerMedicos() {
    // Muestra la tarjeta de carga:
    this.loading = true;
    this.loaderText_Card = 'Cargando lista de médicos';

    // Realizando la petición:
    await this.medicoService.obtenerMedicos(0).then(results => {
      // ... Añade la respueste al arreglo de médicos:
      this.medicos = results['doctores'];
      /** PRUEBA: Imprime los médicos capturados. */
      console.log('Médicos capturados:', this.medicos);
      // ... Muestra el total de registros:
      this.totalRegistrados = results['total'];
      // ...Habilita la actualización de la lista de médicos:
      this.updateList = true;
      // ... Oculta la tarjeta de carga:
      this.loading = false;
    });
  };

  // Función para actualizar la lista de médicos registrados a la más actualizada:
  async actualizarLista_Medicos(event) {
    // Elimina los usuarios listados en pantalla, muestra el mensaje de carga
    this.medicos = [];
    this.completeListener = true;
    this.listenerText = 'Actualizando lista de medicos registrados...';
    this.desde = 0;
    this.infiniteScroll.disabled = false;

    // Relizando la petición:
    await this.medicoService.obtenerMedicos(0).then(results => {
      // ... Añade la respuesta al arreglo de médicos:
      this.medicos = results['doctores'];
      /** PRUEBA: Imprime los médicos capturados. */
      console.log('Médicos actualizados capturados:', this.medicos);
      // ... Muestra el total de registros:
      this.totalRegistrados = results['total'];
      // ... Habilita la actualización de la lista de médicos:
      this.updateList = true;
      // ... Detén la actualización.
      event.target.complete();
      // ... Y oculta la tarjeta de carga:
      this.loading = false;
    });
  };

  // Función que recarga más usuarios al cambiar paginado de registros:
  async reloadDoctors(valor: number) {
    // Suma el valor enviado, añádelo a "desde", e imprímelo en consola:
    this.desde += valor;
    console.log(this.desde);

    // Valida si el valor de desde es mayor o igual al número de registros, si es así, entonces ejecuta lo siguiente:
    if (this.desde >= this.totalRegistrados) {
      this.desde -= valor - 10;
      this.infiniteScroll.disabled = true;
      this.completeListener = true;
      this.listenerText = 'Se han mostrado todos los resultados.'
    };

    // Realiza la petición y añade los nuevos resultados al arreglo original de "usuarios":
    await this.medicoService.obtenerMedicos(this.desde).then(resp => {
      console.log(resp);
      this.medicos.push(...resp['doctores']);

      this.infiniteScroll.complete();
    });
  };

  // Función para editar los datos de un médico seleccionado:
  async editarMedico(medico: Medico) {
    /** PRUEBA: Imprime en consola los datos del médico seleccionado */
    console.log('Datos del médico seleccionado:', medico);

    // Abre el modal para editar al médico seleccionado:
    const modal = await this.modalController.create({
      component: EditarMedicoComponent,
      componentProps: { medico: medico },
      cssClass: 'my-custom-class'
    });
    await modal.present(); 
    // ... una vez abierto, cierra el sliding.
    this.ionList.closeSlidingItems();

    // Al cerrar el modal, recibe los datos del medico actualizado:
    const { data } = await modal.onDidDismiss();
    /** PRUEBA: Imprime en consola los datos recibidos. */
    console.log(data);

    // Si existen datos recibidos entonces ejecuta las siguientes acciones:
    if (data) {
      // ... recupera los datos obtenidos del modal,
      const medicoActualizado = data.itemReturned;
      // ... busca en "usuarios" al usuario recibido mediante su ID y ejecuta lo siguiente:
      const estaEnLista = this.medicos.find((item) => {
        if (item._id === medico._id) {
          item.nombre = medicoActualizado.nombre;

          return true;
        }
      });

      // Ya con los datos obtnenidos, añade los datos al usuario seleccionado.
      if (!estaEnLista) {
        this.medicos.push(medicoActualizado)
      }
    };
  };

  // Función para eliminar a un médico seleccionado:
  async eliminarMedico(medico: Medico) {
    /** PRUEBA: Imprime en consola los datos de médico seleccionado. */
    console.log('Datos del médico seleccionado:', medico);

    // Requiere de los siguientes datos para continuar:
    const id = medico._id;

    // Muestra una alerta antes de eliminar al usuario:
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: `¿Seguro?`,
      message: `Estas por eliminar a ${medico.nombre}, si deseas ejecutar la acción, presiona Eliminar.`,
      buttons: [
        {
          text: 'Eliminar',
          cssClass: 'delete',
          handler: async () => {
            // Realizando la petición;
            await this.medicoService.eliminaMédico(id).then(async (doctorData: any) => {
              /** PRUEBA: Imprime los datos de la respuesta a la petición. */
              console.log('Datos recibidos de la petición:', doctorData);

              // Si la petición fue exitosa entonces muestra una alerta con los datos recibidos:
              if (doctorData.header) {
                const alert = await this.alertController.create({
                  backdropDismiss: false,
                  header: 'Realizado',
                  message: doctorData.header
                });
                await alert.present();

                setTimeout(() => {
                  this.alertController.dismiss();
                }, 2000);

                // ...borra al usuario eliminado de la lista de usuarios mostrados y,
                const medicoSelec = this.medicos.findIndex(m => m._id === medico._id);
                this.medicos.splice(medicoSelec, 1);
                // ... resta 1 al conteo de registros:
                this.totalRegistrados -= 1;
                // ... cierra el sliding.
                this.ionList.closeSlidingItems();
              }
            });
          }
        }, {
          text: 'Cancelar',
          cssClass: 'cancel',
          handler: () => {
            /** PRUEBA: Muestra mensaje en consola de la acción a realizar, */
            console.log('Operación cancelada');
            // Cierra el sliding:
            this.ionList.closeSlidingItems();
          }
        }
      ]
    });
    // ... presenta el mensaje creado.
    await alert.present();
  };

  // Función para realizar una 
  async busqueda(event) {
    /** PRUEBA: Imprime los caracteres de búsqueda. */
    // console.log(event.detail.value);

    // Antes de que se realize la búsqueda, muestra la tarjeta de carga y elimina los usuarios listados:
    this.medicos = [];
    this.loading = true;
    this.loaderText_Card = 'Buscando usuarios...'
    this.completeListener = false;
    this.infiniteScroll.disabled = false;

    // Valida el campo de búsqueda y ejecuta las siguientes acciones:
    if (event.detail.value === '') {
      this.obtenerMedicos();
      this.desde = 0;
      this.completeListener = false;
    };

    // Realiza la petición: 
    await this.busquedasService.busqueda_Coleccion(event.detail.value, 'doctores').then((results: []) => {
      /** Imprime en consola los resultados de búsqueda. */
      // console.log(results);

      // Si no hay un resultado con el valor de búsqueda sugerido, entonces muestra el siguiente mensaje:
      if (results.length === 0) {
        this.loading = false;
        this.completeListener = true;
        this.listenerText = 'No hay resultados con el criterio de búsqueda solicitado.'
      } else if (results.length > 0) {
        this.loading = false;
        this.medicos = results;
      };
    });

  };

}