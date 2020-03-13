import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;
  imagenTemp: any;

  constructor( public _usuarioService: UsuarioService ) {
    this.usuario = this._usuarioService.usuario;
    // console.log(this.usuario);
  }

  ngOnInit() {
  }

  guardar( usuario: Usuario ) {

    // console.log( usuario );
    this.usuario.nombre = usuario.nombre;
    if ( !this.usuario.google ) { 
      this.usuario.email = usuario.email;
    }

    this._usuarioService.actualizarUsuario( this.usuario )
        .subscribe();

  }

  seleccionImage( archivo: File ) {
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }
    // console.log(archivo);

    if ( !archivo.type.includes('image') ) {
      this.imagenSubir = null;
      Swal.fire('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImageTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  cambiarImagen() {
    this._usuarioService.cambiarImagen( this.imagenSubir, this.usuario._id );
  }

}
