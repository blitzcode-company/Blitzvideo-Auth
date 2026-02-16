import { Component } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { StatusService } from '../../servicios/status.service';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MensajeService } from '../../servicios/mensaje.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../../servicios/theme.service';

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
    private mensaje: MensajeService,
    private themeService: ThemeService,
    ){}

  ngOnInit() {
    this.titleService.setTitle('Registro - BlitzVideo');

  }

  registroUsuario(credentials: any) {
    this.resetAlerts();
    this.isLoading = true;

    this.authService.registro(credentials).subscribe({
      next: (res: any) => {
        this.mensaje.setUsuarioRegistradoExitosamente(true);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log(error)
        this.isLoading = false;

        if (error.status === 422 && error.error?.errors) {
        const errores = error.error.errors;
        this.mensajeError = Object.values(errores)
          .flat()
          .join('\n');
      } else {
        this.mensajeError = 'Error inesperado. Por favor, inténtalo de nuevo.';
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
  if (!form.valid) {
    this.sinCredenciales = true;
    form.form.markAllAsTouched(); 
    return;
  }
  this.registroUsuario(form.value);
}
}
