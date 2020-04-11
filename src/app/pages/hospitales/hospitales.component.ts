import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/hospital.service';
import { Hospital } from '../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  totalRegistros = 0;
  cargando = true;
  nombreHospital: string;
  nombreHospModel: string;

  constructor( public _hospitalService: HospitalService,
               public _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion
        .subscribe( resp => this.cargarHospitales() );
  }

  cargarHospitales() {
    this.cargando = true;
    this._hospitalService.cargarHospitales()
        .subscribe( (resp: any) => {
          // console.log(hospitales);
          this.hospitales = resp.hospitales;
          this.totalRegistros = resp.total;
          this.cargando = false;
        });
  }

  crearHospital() {
    Swal.fire({
      title: 'Crear hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      showLoaderOnConfirm: true,
      preConfirm: (nombre) => {
        // console.log(nombre);
        this.nombreHospital = nombre;
        const hospital = new Hospital(
          nombre = this.nombreHospital
        );

        this._hospitalService.crearHospital( hospital )
            .subscribe( resp => {
              // console.log(resp);
              if ( this.nombreHospital !== '' ) {
                Swal.fire( 'Hospital creado', this.nombreHospital, 'success' );
                this.cargarHospitales();
              }
            });

        // return this.nombreHospital;
      }
    });
  }

  buscarHospital( termino: string ) {
    // console.log(termino);
    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalService.buscarHospital( termino )
        .subscribe( (resp: any) => {
          this.cargando = false;
          this.hospitales = resp.hospitales;
          this.totalRegistros = resp.hospitales.length;
          // console.log(resp);
        });
  }

  actualizarHospital( hospital: Hospital ) {
    // const hospTemp = hospital;

    this._hospitalService.actualizarHospital( hospital )
        .subscribe();
  }

  eliminarHospital( hospital: Hospital ) {
    // console.log(hospital);
    Swal.fire({
      title: '¿Está seguro que desea borrar el hospital?',
      text: '¡Si se borra el hospital no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, borrar'
    }).then( result => {
      // console.log(result);
      if (result.value) {

        this._hospitalService.eliminarHospital( hospital._id )
            .subscribe( resp => {
              Swal.fire( '¡Borrado!', 'Se borro correctamente.', 'success' );
              this.cargarHospitales();
            });

      }
    });
  }

  abrirModal( id: string ) {
    this._modalUploadService.mostrarModal( 'hospitales', id );
  }

}
