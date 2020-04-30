import { Component, OnInit } from '@angular/core';
import { MedicosService } from '../../services/medicos.service';
import { Medico } from '../../models/medico.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  totalRegistros = 0;

  constructor( public _medicosService: MedicosService ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this._medicosService.cargarMedicos()
        .subscribe( (resp: any) => {
          this.medicos = resp.medicos;
          this.totalRegistros = resp.total;
        });
  }

  buscarMedico( termino ) {
    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }
    this._medicosService.buscarMedico(termino)
        .subscribe( (resp: any) => {
          // console.log(resp);
          this.medicos = resp.medicos;
          this.totalRegistros = resp.medicos.length;

        });
  }

  eliminarMedico( medico: Medico ) {
    Swal.fire({
      title: '¿Está seguro que desea borrar al médico?',
      text: '¡Si se borra el médico no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, borrar'
    }).then( result => {
      // console.log(result);
      if (result.value) {

        this._medicosService.eliminarMedico( medico._id )
            .subscribe( resp => {
              Swal.fire( '¡Borrado!', 'Se borro correctamente.', 'success' );
              this.cargarMedicos();
            });
      }
    });
  }

}
