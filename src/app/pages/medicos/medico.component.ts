import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital.service';
import { Medico } from '../../models/medico.model';
import { MedicosService } from '../../services/medicos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hopitales: Hospital[] = [];
  medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor( public _hospitalService: HospitalService,
               public _medicoService: MedicosService,
               public router: Router,
               public activatedRoute: ActivatedRoute,
               public _modalUploadService: ModalUploadService) {

                this.activatedRoute.params.subscribe( params => {
                  const id = params['id'];

                  if ( id !== 'nuevo' ) {
                    this.buscarMedicoId( id );
                  }
                });
  }

  ngOnInit() {
    this._hospitalService.cargarHospitales()
        .subscribe( (resp: any) => {
          // console.log(resp);
          this.hopitales = resp.hospitales;
        });

    this._modalUploadService.notificacion
        .subscribe( resp => {
          // console.log(resp);
          this.medico.img = resp.medico.img;
        });
  }

  buscarMedicoId( id: string ) {
    this._medicoService.buscarMedicoId( id )
        .subscribe( (resp: any) => {
          console.log(resp);
          this.medico = resp.medico;
          this.medico.hospital = resp.medico.hospital._id;
          this.cambioHospital( this.medico.hospital );
        });
  }

  guardarMedico( f: NgForm ) {
    // console.log(f.valid);
    // console.log(f.value);
    if ( f.invalid ) {
      return;
    }
    this._medicoService.crearMedico( this.medico )
        .subscribe( (medico: any) => {
          // console.log(resp);
          // console.log(this.medico);
          this.medico._id = medico._id;
          this.router.navigate(['/medico', medico._id]);
        });
  }

  cambioHospital( id: string ) {
    // console.log( id );
    this._hospitalService.obtenerHospital( id )
        .subscribe( resp => {
          // console.log(resp);
          this.hospital = resp;
        });
  }

  cambiarFoto() {
    this._modalUploadService.mostrarModal( 'medicos', this.medico._id );
  }

}
