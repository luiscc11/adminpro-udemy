import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  menu: any = [];
  usuario: Usuario;

  constructor( public _sidebarService: SidebarService,
               public _userService: UsuarioService ) {
  }

  ngOnInit() {
    this.usuario = this._userService.usuario;
    this._sidebarService.cargarMenu();
  }

}
