import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { StatusService } from '../../servicios/status.service';
import { CookieService } from 'ngx-cookie-service';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MensajeService } from '../../servicios/mensaje.service';
import { environment } from '../../../environments/environment.prod';
import { Subscription } from 'rxjs';

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

enum HttpStatusCode {
  Unauthorized = 401,
  BadRequest = 400
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginError: boolean = false;
  public loginAlerta: string = '';
  showPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  public loginStatus: boolean = false;
  usuarioRegistradoExitosamente: boolean = false;
  serverIp = environment.serverIp;

  defaultMensajeDeError: string = 'Error de red. Por favor, inténtalo de nuevo más tarde.';

  static mensajesDeError: { [key: number]: string } = {
    [HttpStatusCode.Unauthorized]: 'Usuario o contraseña incorrectos.',
    [HttpStatusCode.BadRequest]: 'Por favor, verifica tus datos.',
  };

  private subscription!: Subscription;

  constructor(
    private api: AuthService,
    private router: Router,
    private status: StatusService,
    private cookie: CookieService,
    private titleService: Title,
    private mensaje: MensajeService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Login - BlitzVideo');
    this.subscription = this.mensaje.usuarioRegistrado$.subscribe(
      (registradoExitosamente: boolean) => {
        this.usuarioRegistradoExitosamente = registradoExitosamente;
        this.loginAlerta = '';
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  sendLogin(credentials: any) {
    return this.api.sendLogin(credentials).subscribe(
      (res: any) => {
        this.cookie.set('accessToken', res.access_token);
        this.status.isLoggedIn = true;
        window.location.href = `${this.serverIp}3000/#/`;
      },
      (error) => {
        this.loginAlerta = LoginComponent.mensajesDeError[error.status] || this.defaultMensajeDeError;
        this.usuarioRegistradoExitosamente = false;
      }
    );
  }

  closeAlert(event?: Event): void {
    if (event) {
      event.stopPropagation();  
    }
    this.loginAlerta = '';
    this.usuarioRegistradoExitosamente = false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.sendLogin(form.value);
    }
  }
}
