import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  menu: any = [];

  constructor( public _sidebarService: SidebarService,
               public _userService: UsuarioService ) {
  }

  ngOnInit() {
  }

}
