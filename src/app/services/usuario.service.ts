import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { URL_SERVICIOS } from '../config/config';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from './subir-archivo.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor( public http: HttpClient,
              public router: Router,
              public _subirArchivo: SubirArchivoService) {
    // console.log('Servicio de usuario listo');
    this.cargarStorage();
  }

  renuevaToken() {
    const url = `${URL_SERVICIOS}/login/renuevatoken?token=${this.token}`;

    return this.http.get( url )
              .pipe(
                map( (resp: any) => {
                  this.token = resp.token;
                  localStorage.setItem('token', this.token);
                  return true;
                }),
                catchError( err => {
                  // console.log(err.error.mensaje);
                  this.router.navigate(['/login']);
                  Swal.fire('No se pudo renovar token', 'No fue posible renovar token', 'error');
                  return Observable.throw( err );
                })
              );
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
      this.menu = JSON.parse( localStorage.getItem('menu') );
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify( usuario ));
    localStorage.setItem('menu', JSON.stringify( menu ));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    const url = `${URL_SERVICIOS}/login/google`;

    return this.http.post( url, { token } )
              .pipe(
                map( (resp: any) => {
                    this.guardarStorage( resp.id, resp.token, resp.usuarioDB, resp.menu );
                    console.log(resp);
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
                  this.guardarStorage( resp.id, resp.token, resp.usuarioDB, resp.menu );
                  return true;
                }),
                catchError( err => {
                  // console.log(err.error.mensaje);
                  Swal.fire('Error en login', err.error.mensaje, 'error');
                  return Observable.throw( err );
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
                  }),
                  catchError( err => {
                    // console.log(err.error.mensaje);
                    Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
                    return Observable.throw( err );
                  })
                );
  }

  actualizarUsuario( usuario: Usuario ) {
    const url = `${URL_SERVICIOS}/usuario/${usuario._id}?token=${this.token}`;

    return this.http.put( url, usuario )
                .pipe(
                  map( (resp: any) => {
                    if ( usuario._id === this.usuario._id ) {
                      this.guardarStorage( resp.usuario._id, this.token, resp.usuario, this.menu );
                    }
                    Swal.fire( 'Usuario actualizado', resp.usuario.nombre, 'success' );
                    return true;
                  }),
                  catchError( err => {
                    // console.log(err.error.mensaje);
                    Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
                    return Observable.throw( err );
                  })
                );
  }

  cambiarImagen( archivo: File, id: string ) {
    this._subirArchivo.subirArchivo( archivo, 'usuarios', id )
        .then( (resp: any) => {
          // console.log(resp);
          this.usuario.img = resp.usuario.img;
          this.guardarStorage( id, this.token, this.usuario, this.menu );
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
