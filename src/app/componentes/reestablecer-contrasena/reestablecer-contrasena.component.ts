import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reestablecer-contrasena',
  templateUrl: './reestablecer-contrasena.component.html',
  styleUrl: './reestablecer-contrasena.component.css'
})
export class ReestablecerContrasenaComponent {
  email = '';
  token = '';
  password = '';
  password_confirmation = '';
  mensaje = '';

  constructor(private authService: AuthService,    
              private router: Router,
              private route: ActivatedRoute, 
              private titleService: Title) {

    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    
    if (!this.email || !this.token) {
      this.mensaje = 'No se encontraron los parámetros necesarios para restablecer la contraseña.';
    }
  }

  ngOnInit() {
    this.titleService.setTitle('Reestablecer contraseña - BlitzVideo');
   
  }

  restablecerContrasena() {
    if (this.password !== this.password_confirmation) {
      this.mensaje = 'Las contraseñas no coinciden.';
      return;
    }

    this.authService.resetPassword(this.email, this.token, this.password, this.password_confirmation).subscribe(
      response => {
        this.mensaje = 'Contraseña restablecida con éxito.';
        this.router.navigate(['/']);

      },
      error => {
        this.mensaje = 'Hubo un problema al restablecer la contraseña.';
      }
    );
  }

}
