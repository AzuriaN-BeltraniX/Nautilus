import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private usuarioService: UsuarioService
  ) {}

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    /** PRUEBA: Imprime en consola un mensaje que verifica la ejecución del authGuard */
    console.info(`¡AuthGuard activado!`);
    
    // Retorna el valor false:
    // return true;
    return this.usuarioService.validarToken();
  }
  
}
