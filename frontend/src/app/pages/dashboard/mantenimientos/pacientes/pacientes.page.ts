import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController, IonInfiniteScroll, IonList, ToastController } from '@ionic/angular';
import { environment } from '../../../../../environments/environment.prod';

import { Paciente } from 'src/app/models/paciente.model';
import { PacienteService } from '../../../../services/paciente.service';
import { BusquedasService } from '../../../../services/busquedas.service';
import { EditarCrearComponent } from './editar-crear/editar-crear.component';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.page.html',
  styleUrls: ['./pacientes.page.scss'],
})
export class PacientesPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonList) ionList: IonList;

  // Declarando variables para su reutilización:
  public baseUrl: string = environment.baseUrl
  public noImage: string = 'noImage.svg';

  public pacientes: Paciente[] = [];
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
    private toastController: ToastController,
    private pacienteService: PacienteService,
    private busquedasService: BusquedasService
  ) { }

  ngOnInit() {
    // Captura a los pacientes y muéstralos en pantalla:
    this.obtenerPacientes();
  }

  // Función para registrar un paciente:
  async crearPaciente() {
    /** PRUEBA: Imprime en consola mensaje de funcionamiento. */
    console.log('>>! Funciona crear médico...');
    
    // Abre el modal para registrar a un nuevo médico:
    const modal = await this.modalController.create({
      component: EditarCrearComponent,
      cssClass: 'my-custom-class',
      componentProps: {create: true}
    });
    await modal.present();

    // Al cerrar el modal, recibe los datos del medico actualizado:
    const { data } = await modal.onDidDismiss();
    /** PRUEBA: Imprime en consola los datos recibidos. */
    console.log(data);

    // Si existen datos recibidos entonces ejecuta las siguientes acciones:
    if (data.itemReturned === true) {
      this.desde = 0
      this.pacientes = [];
      this.completeListener = false;
      this.infiniteScroll.disabled = false;

      this.obtenerPacientes();
    };
  };

  // Función para obtener una lista de los médicos registrados:
  async obtenerPacientes() {
    // Muestra la tarjeta de carga:
    this.loading = true;
    this.loaderText_Card = 'Cargando lista de médicos';

    // Realizando la petición:
    await this.pacienteService.obtenerPacientes(0).then((results: any) => {
      // ... Añade la respueste al arreglo de médicos:        
      this.pacientes = results.pacientes;
      /** PRUEBA: Imprime los médicos capturados. */
      console.log('Pacientes capturados:', this.pacientes);
      // ... Muestra el total de registros:
      this.totalRegistrados = results.total;
      // ...Habilita la actualización de la lista de médicos:
      this.updateList = true;
      // ... Oculta la tarjeta de carga:
      this.loading = false;
    });
  };

  // Función para actualizar la lista de médicos registrados a la más actualizada:
  async actualizarLista_Pacientes(event) {
    // Elimina los usuarios listados en pantalla, muestra el mensaje de carga
    this.pacientes = [];
    this.completeListener = true;
    this.listenerText = 'Actualizando lista de usuarios registrados...';
    this.desde = 0;
    this.infiniteScroll.disabled = false;

    // Relizando la petición:
    await this.pacienteService.obtenerPacientes(0).then((results: any) => {
      // ... Añade la respuesta al arreglo de médicos:
      this.pacientes = results.pacientes;
      /** PRUEBA: Imprime los médicos capturados. */
      console.log('Pacientes actualizados capturados:', this.pacientes);
      // ... Muestra el total de registros:
      this.totalRegistrados = results.total;
      // ... Habilita la actualización de la lista de médicos:
      this.updateList = true;
      // ... Detén la actualización.
      event.target.complete();
      // ... Y oculta la tarjeta de carga:
      this.loading = false;
    });
  };

  // Función que recarga más usuarios al cambiar paginado de registros:
  async reloadPatients(valor: number) {
    // Suma el valor enviado, añádelo a "desde", e imprímelo en consola:
    this.desde += valor;
    // console.log(this.desde);

    // Valida si el valor de desde es mayor o igual al número de registros, si es así, entonces ejecuta lo siguiente:
    if (this.desde >= this.totalRegistrados) {
      this.desde -= valor - 10;
      this.infiniteScroll.disabled = true;
      this.completeListener = true;
      this.listenerText = 'Se han mostrado todos los resultados.'
    };

    // Realiza la petición y añade los nuevos resultados al arreglo original de "usuarios":
    await this.pacienteService.obtenerPacientes(this.desde).then((resp: any) => {
      this.pacientes.push(...resp.pacientes);
      this.infiniteScroll.complete();
    });
  };

  // Función para editar los datos de un médico seleccionado:
  async editarPaciente(paciente: Paciente) {
    console.log('Datos del paciente seleccionado:', paciente);

    // Abre el modal para editar al médico seleccionado:
    const modal = await this.modalController.create({
      component: EditarCrearComponent,
      componentProps: { paciente: paciente, create: false },
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
      const estaEnLista = this.pacientes.find((item) => {
        if (item._id === paciente._id) {
          item.nombre = medicoActualizado.nombre;
          item.edad = medicoActualizado.edad;
          item.email = medicoActualizado.email;

          return true;
        }
      });

      // Ya con los datos obtnenidos, añade los datos al usuario seleccionado.
      if (!estaEnLista) {
        this.pacientes.push(medicoActualizado)
      }
    };
  };

  // Función para eliminar a un médico seleccionado:
  async eliminarPaciente(paciente: Paciente) {
    /** PRUEBA: Imprime en consola los datos de médico seleccionado. */
    console.log('Datos del paciente seleccionado:', paciente);

    // Requiere de los siguientes datos para continuar:
    const id = paciente._id;

    // Muestra una alerta antes de eliminar al usuario:
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: `¿Seguro?`,
      message: `Estas por eliminar a ${paciente.nombre}, si deseas ejecutar la acción, presiona Eliminar.`,
      buttons: [
        {
          text: 'Eliminar',
          cssClass: 'delete',
          handler: async () => {
            // Realizando la petición;
            await this.pacienteService.eliminarPaciente(id).then(async (pacienteData: any) => {
              /** PRUEBA: Imprime los datos de la respuesta a la petición. */
              console.log('Datos recibidos de la petición:', pacienteData);

              // Si la petición fue exitosa entonces muestra una alerta con los datos recibidos:
              if (pacienteData.header) {
                const toast = await this.toastController.create({
                  header: pacienteData.header,
                  position: 'bottom'
                });
                toast.present();
                // ... cierra la alerta en 2.5 segundos:
                setTimeout(() => {
                  this.toastController.dismiss();
                }, 3000);

                // ...borra al usuario eliminado de la lista de usuarios mostrados y,
                const medicoSelec = this.pacientes.findIndex(p => p._id === paciente._id);
                this.pacientes.splice(medicoSelec, 1);
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
    this.pacientes = [];
    this.loading = true;
    this.loaderText_Card = 'Buscando usuarios...'
    this.completeListener = false;
    this.infiniteScroll.disabled = false;

    // Valida el campo de búsqueda y ejecuta las siguientes acciones:
    if (event.detail.value === '') {
      this.obtenerPacientes();
      this.desde = 0;
      this.completeListener = false;
    };

    // Realiza la petición: 
    await this.busquedasService.busqueda_Coleccion(event.detail.value, 'pacientes').then((results: []) => {
      /** Imprime en consola los resultados de búsqueda. */
      // console.log(results);

      // Si no hay un resultado con el valor de búsqueda sugerido, entonces muestra el siguiente mensaje:
      if (results.length === 0) {
        this.loading = false;
        this.completeListener = true;
        this.listenerText = 'No hay resultados con el criterio de búsqueda solicitado.'
      } else if (results.length > 0) {
        this.loading = false;
        this.pacientes = results;
      };
    });

  };

}
