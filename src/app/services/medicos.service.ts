import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { Medico } from '../models/medico.model';
import { UsuarioService } from './usuario.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  medico: Medico;

  constructor( public http: HttpClient,
                public _usuarioService: UsuarioService ) {}

  cargarMedicos() {
    const url = `${URL_SERVICIOS}/medico`;

    return this.http.get( url );
  }

  buscarMedico( termino: string ) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/medicos/${termino}`;

    return this.http.get( url );
  }

  eliminarMedico( id: string ) {
    const url = `${URL_SERVICIOS}/medico/${id}?token=${this._usuarioService.token}`;

    return this.http.delete( url );
  }

  crearMedico( medico: Medico ) {
    const url = `${URL_SERVICIOS}/medico?token=${this._usuarioService.token}`;

    return this.http.post( url, medico )
                .pipe(
                  map( (resp: any) => {
                    Swal.fire( 'Médico creado', medico.nombre, 'success');
                    // console.log(resp.body);
                    return resp.body;
                  })
                );
  }

}
