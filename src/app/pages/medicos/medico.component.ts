import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital.service';
import { Medico } from '../../models/medico.model';
import { MedicosService } from '../../services/medicos.service';
import { Router } from '@angular/router';

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
               public router: Router ) {
  }

  ngOnInit() {
    this._hospitalService.cargarHospitales()
        .subscribe( (resp: any) => {
          // console.log(resp);
          this.hopitales = resp.hospitales;
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

  cambioHospital( id ) {
    // console.log( id );
    this._hospitalService.obtenerHospital( id )
        .subscribe( resp => {
          // console.log(resp);
          this.hospital = resp;
        });
  }

}
