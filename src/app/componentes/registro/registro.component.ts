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
  showPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  public passwordSinCoincidir: boolean = false;
  usuarioYaExiste = false;
  usuarioRegistradoExitosamente = false;
  isLoading: boolean = false;


  constructor(private api:AuthService, 
    private router:Router, 
    private status: StatusService, 
    private titleService: Title,     
    private mensaje: MensajeService
    ){}

  ngOnInit() {
    this.titleService.setTitle('Registro - BlitzVideo');

  }
  registroUsuario(credentials: any) {
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

    this.api.registro(credentials).subscribe(
      (res: any) => {
        this.mensaje.setUsuarioRegistradoExitosamente(true);
        this.router.navigate(['/']);
      },
      (error) => {
        this.isLoading = false;

        if (error.status === 422 && error.error.email) {
          this.usuarioYaExiste = true;
        } else {
          console.error('Error al registrar usuario', error);
        }
      }
    );
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
