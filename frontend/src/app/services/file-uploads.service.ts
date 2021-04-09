import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { DataLocalService } from './dataLocal.service';

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class FileUploadsService {

    constructor(
      private http: HttpClient,
      private fileTransfer: FileTransfer,
      private dataLocalService: DataLocalService
    ) { }

  // Función para actualizar la imagen de perfil
  async actualizarFoto(filePath: string, type: 'users' | 'medicos' | 'pacientes', id: string) {
    // Requiere de los siguientes datos para continuar:
    const options: FileUploadOptions = {
      fileKey: 'image',
      headers: {
        'x-token': this.dataLocalService.token
      }
    };

    // Definiendo los parámetros para la petición:
    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    await fileTransfer.upload(filePath, `${baseUrl}/upload/${type}/${id}`, options).then(resp => {
      console.log(resp);
    }).catch(err => {
      console.log('Error en la carga', err);
    });
  };

}
