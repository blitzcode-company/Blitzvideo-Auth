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

  public today: string = '';
  public minDate: string = '';

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

    const todayDate = new Date();
    this.today = todayDate.toISOString().split('T')[0]; 

    const minYearDate = new Date();
    minYearDate.setFullYear(todayDate.getFullYear() - 120);
    this.minDate = minYearDate.toISOString().split('T')[0];

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

esFechaValida(fecha: string): boolean {
    if (!fecha) return false;

    const fechaNacimiento = new Date(fecha);
    const hoy = new Date();

    fechaNacimiento.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    if (fechaNacimiento > hoy) {
      return false;
    }

    const fechaMinima = new Date();
    fechaMinima.setFullYear(hoy.getFullYear() - 120);

    if (fechaNacimiento < fechaMinima) {
      return false;
    }

    return true;
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

  const fechaNac = form.value.fecha_de_nacimiento;
    if (fechaNac && !this.esFechaValida(fechaNac)) {
      this.mensajeError = 'La fecha de nacimiento no es válida. Debe ser una fecha pasada y razonable.';
      return;
    }

    
  this.registroUsuario(form.value);
}
}
