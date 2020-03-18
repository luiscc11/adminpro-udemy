import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { URL_SERVICIOS } from '../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from './subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( public http: HttpClient,
               public router: Router,
               public _subirArchivo: SubirArchivoService) {
    // console.log('Servicio de usuario listo');
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario ) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify( usuario ));

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    const url = `${URL_SERVICIOS}/login/google`;

    return this.http.post( url, { token } )
               .pipe(
                 map( (resp: any) => {
                    this.guardarStorage( resp.id, resp.token, resp.usuarioDB );
                    return true;
                 })
               );
  }

  login( usuario: Usuario, recordar: boolean = false ) {

    if ( recordar ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = `${URL_SERVICIOS}/login`;

    return this.http.post( url, usuario )
               .pipe(
                 map( (resp: any) => {
                  this.guardarStorage( resp.id, resp.token, resp.usuarioDB );
                  return true;
                 })
               );
  }

  crearUsuario( usuario: Usuario ) {
    const url = `${URL_SERVICIOS}/usuario`;

    return this.http.post( url, usuario )
                .pipe(
                  map( (resp: any) => {
                    Swal.fire( 'Usuario creado', usuario.email, 'success');
                    return resp.usuario;
                  })
                );
  }

  actualizarUsuario( usuario: Usuario ) {
    const url = `${URL_SERVICIOS}/usuario/${usuario._id}?token=${this.token}`;

    return this.http.put( url, usuario )
                .pipe(
                  map( (resp: any) => {
                    if ( usuario._id === this.usuario._id ) {
                      this.guardarStorage( resp.usuario._id, this.token, resp.usuario );
                    }
                    Swal.fire( 'Usuario actualizado', resp.usuario.nombre, 'success' );
                    return true;
                  })
                );
  }

  cambiarImagen( archivo: File, id: string ) {
    this._subirArchivo.subirArchivo( archivo, 'usuarios', id )
        .then( (resp: any) => {
          // console.log(resp);
          this.usuario.img = resp.usuario.img;
          this.guardarStorage( id, this.token, this.usuario );
          Swal.fire( 'Imagen actualizada', resp.usuario.nombre, 'success' );
        })
        .catch( resp => {
          console.log(resp);
        });
  }

  cargarUsuarios( desde: number = 0 ) {
    const url = `${URL_SERVICIOS}/usuario?desde=${desde}`;
    // console.log(url);
    return this.http.get( url );
  }

  buscarUsuario( termino: string ) {
    // console.log(termino);
    const url = `${URL_SERVICIOS}/busqueda/coleccion/usuarios/${termino}`;
    return this.http.get( url );
  }

  eliminaUser( id: string ) {
    // console.log(id);
    const url = `${URL_SERVICIOS}/usuario/${id}?token=${this.token}`;
    console.log(url);

    return this.http.delete( url );
  }
}
