import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { Hospital } from '../models/hospital.model';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SubirArchivoService } from './subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  hospital: Hospital;
  token: string;

  constructor( public http: HttpClient,
               public _subirArchivo: SubirArchivoService ) {
    this.cargarStorage();
  }

  cargarHospitales() {
    const url = `${URL_SERVICIOS}/hospital`;

    return this.http.get( url );
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
    } else {
      this.token = '';
    }
  }

  crearHospital( hospital: Hospital )  {
    const url = `${URL_SERVICIOS}/hospital?token=${this.token}`;

    return this.http.post( url, hospital )
                .pipe(
                  map((resp: any) => {
                      Swal.fire( 'Hospital creado', hospital.nombre, 'success');
                      return resp.hospital;
                  })
                );
  }

  buscarHospital( termino: string ) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/hospitales/${termino}`;

    return this.http.get( url );
  }

  obtenerHospital( id: string ) {
    const url = `${URL_SERVICIOS}/hospital/${id}`;

    return this.http.get( url )
              .pipe(
                map( (resp: any) => resp.hospital)
              );
  }

  eliminarHospital( id: string ) {
    const url = `${URL_SERVICIOS}/hospital/${id}?token=${this.token}`;

    return this.http.delete( url );
  }

  actualizarHospital( hospital: Hospital  ) {
    const url = `${URL_SERVICIOS}/hospital/${hospital._id}?token=${this.token}`;

    return this.http.put( url, hospital )
                .pipe(
                  map( (resp: any) => {
                    Swal.fire( 'Hospital actualizado', resp.hospital.nombre, 'success' );
                    return true;
                  })
                );
  }

  cambiarImagen( archivo: File, id: string ) {
    this._subirArchivo.subirArchivo( archivo, 'hospitales', id )
        .then( (resp: any) => {
          // console.log(resp);
          this.hospital.img = resp.usuario.img;
          Swal.fire( 'Imagen actualizada', resp.hospital.nombre, 'success' );
        })
        .catch( resp => {
          console.log(resp);
        });
  }

}
