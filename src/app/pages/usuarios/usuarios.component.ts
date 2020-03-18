import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;
  activado = true;

  constructor( public _usuarioService: UsuarioService,
              public _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion
        .subscribe( resp => this.cargarUsuarios() );
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios( this.desde )
        .subscribe( (resp: any) => {
          // console.log(resp);
          this.usuarios = resp.usuarios;
          this.totalRegistros = resp.total;
          this.cargando = false;
          this.activado = true;
        });
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;
    // console.log(desde);
    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ) {
    // console.log(termino);
    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    this._usuarioService.buscarUsuario( termino )
        .subscribe( (usuarios: any) => {
          // console.log(resp);
          this.usuarios = usuarios.usuarios;
          // console.log( this.usuarios.length );
          this.totalRegistros = this.usuarios.length;
          this.cargando = false;
          this.activado = false;
        });
  }

  borrarUsuario( usuario: Usuario ) {
    // console.log(usuario);
    if ( usuario._id === this._usuarioService.usuario._id ) {
      Swal.fire( 'No puede borrar usuario', 'No se puede borrar así mismo', 'error' );
      return;
    }

    // console.log(usuario._id);

    Swal.fire({
      title: '¿Está seguro que desea borrar usuario?',
      text: '¡Si se borra el usuario no se podrá recuperar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, borrar'
    }).then( result => {
      // console.log(result);
      if (result.value) {

        this._usuarioService.eliminaUser( usuario._id )
        .subscribe( resp => {
          console.log(resp);
          Swal.fire( '¡Borrado!', 'Se borro correctamente.', 'success' );
          this.desde = 0;
          this.cargarUsuarios();
        });

      }
    });
  }

  guardarUsuario( usuario: Usuario ) {
    this._usuarioService.actualizarUsuario( usuario )
        .subscribe();
  }

  abrirModal( id: string ) {
    this._modalUploadService.mostrarModal( 'usuarios', id );
  }

}
