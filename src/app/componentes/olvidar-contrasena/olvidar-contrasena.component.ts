import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-olvidar-contrasena',
  templateUrl: './olvidar-contrasena.component.html',
  styleUrl: './olvidar-contrasena.component.css'
})
export class OlvidarContrasenaComponent {
  email = '';
  mensaje = '';

  constructor(private authService: AuthService,
              private titleService: Title,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Olvide mi contraseña - BlitzVideo');
   
  }

  solicitarRestablecimiento() {
    this.authService.enviarRestablecerEnlaceCorreo(this.email).subscribe(
      response => {
        this.mensaje = 'El enlace de restablecimiento ha sido enviado a tu correo electrónico.';
      },
      error => {
        this.mensaje = 'Hubo un problema al enviar el enlace. Verifica tu correo.';
      }
    );
  }
}
