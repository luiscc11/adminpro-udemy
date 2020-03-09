import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame = false;
  email: string;
  auth2: any;

  constructor( public router: Router,
               public _usuarioService: UsuarioService) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    if ( this.email.length > 1 ) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '944374691258-m6cp9uan8asapl1ckd8gns5tot6akemu.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSingin( (document.getElementById('btnGoogle')) );
    });
  }

  attachSingin( element ) {
    this.auth2.attachClickHandler( element, {}, (googleUser) => {
      // let profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;

      // console.log(token);
      this._usuarioService.loginGoogle( token )
          .subscribe( resp => window.location.href = '#/dashboard' );
    });
  }

  ingresar( forma: NgForm ) {
    console.log( forma.valid );
    console.log( forma.value );
    if ( forma.invalid ) {
      return;
    }

    const usuario = new Usuario( null, forma.value.email, forma.value.password );

    this._usuarioService.login( usuario, forma.value.recuerdame )
        .subscribe( correcto => this.router.navigate(['/dashboard']));
    // this.router.navigate([ '/dashboard' ]);

  }

}
