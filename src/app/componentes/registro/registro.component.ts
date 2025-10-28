import { Component } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { StatusService } from '../../servicios/status.service';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MensajeService } from '../../servicios/mensaje.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  public sinCredenciales: boolean = false;
  public passwordSinCoincidir: boolean = false;
  public usuarioYaExiste = false;
  public usuarioRegistradoExitosamente = false;
  public mensajeError: string = '';
  public isLoading: boolean = false;

  showPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;





  constructor(private authService:AuthService, 
    private router:Router, 
    private status: StatusService, 
    private titleService: Title,     
    private mensaje: MensajeService
    ){}

  ngOnInit() {
    this.titleService.setTitle('Registro - BlitzVideo');

  }
  registroUsuario(credentials: any) {

    this.resetAlerts();

    this.sinCredenciales = false;
    this.passwordSinCoincidir = false;
    this.usuarioYaExiste = false;

    if (
      !credentials.name ||
      !credentials.email ||
      !credentials.password ||
      !credentials.fecha_de_nacimiento ||
      !credentials.password_confirmation
    ) {
      this.sinCredenciales = true;
      return;
    }

    if (credentials.password !== credentials.password_confirmation) {
      this.passwordSinCoincidir = true;
      return;
    }


    this.isLoading = true;

    this.authService.registro(credentials).subscribe({
      next: (res: any) => {
        this.mensaje.setUsuarioRegistradoExitosamente(true);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 422 && error.error?.errors) {
          const errors = error.error.errors;

          if (errors.email && errors.email[0].includes('Ya existe')) {
            this.usuarioYaExiste = true;
          } else if (errors.password && errors.password[0].includes('coinciden')) {
            this.passwordSinCoincidir = true;
          } else {
            this.mensajeError = Object.values(errors).flat().join(' ');
          }
        } else {
          this.mensajeError = 'Error inesperado. Por favor, inténtalo de nuevo.';
          console.error('Error al registrar usuario:', error);
        }
      }
    });
  }

  resetAlerts() {
    this.sinCredenciales = false;
    this.passwordSinCoincidir = false;
    this.usuarioYaExiste = false;
    this.mensajeError = '';
  }

  closeAlert(type: string) {
    switch (type) {
      case 'sinCredenciales': this.sinCredenciales = false; break;
      case 'passwordSinCoincidir': this.passwordSinCoincidir = false; break;
      case 'usuarioYaExiste': this.usuarioYaExiste = false; break;
      case 'mensajeError': this.mensajeError = ''; break;
    }
  }



  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.registroUsuario(form.value);
    }
  }
}
