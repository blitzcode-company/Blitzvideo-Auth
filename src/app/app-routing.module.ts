import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './componentes/registro/registro.component';
import { LoginComponent } from './componentes/login/login.component';
import { OlvidarContrasenaComponent } from './componentes/olvidar-contrasena/olvidar-contrasena.component';
import { ReestablecerContrasenaComponent } from './componentes/reestablecer-contrasena/reestablecer-contrasena.component';

const routes: Routes = [

  {path: 'registro', component: RegistroComponent},
  {path: '', component: LoginComponent},
  { path: 'forgot-password', component: OlvidarContrasenaComponent },
  { path: 'password/reset', component: ReestablecerContrasenaComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
