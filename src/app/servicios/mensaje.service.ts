import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  private usuarioRegistradoSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  usuarioRegistrado$: Observable<boolean> = this.usuarioRegistradoSubject.asObservable();

  constructor() {}

  setUsuarioRegistradoExitosamente(value: boolean) {
    this.usuarioRegistradoSubject.next(value);
  }
}
