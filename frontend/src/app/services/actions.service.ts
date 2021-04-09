import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

// Declarando el url para las peticiones:
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(
    private http: HttpClient,
  ) { }

  // Función para cambiar la contraseña de un usuario
  resetPwd_Email(flag) {
    // Requiere de los siguientes datos para continuar:
    const headers = new HttpHeaders({
      'flag': flag
    });

    return new Promise(resolve => {
      this.http.post(`${baseUrl}/info/actionsNautilus/emailResetPwd`, {headers}).subscribe(resp => {
        if (resp['ok'] === true) {
          resolve(resp)
        };
      });
    });
  };
}
