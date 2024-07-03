import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs';
import { catchError } from 'rxjs';
import { of } from 'rxjs';
import { environment } from '../../environments/environment.prod';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authApiUrl = environment.authApiUrl

  private usuarioSubject = new BehaviorSubject<any>(null);
  public usuario$: Observable<any> = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient, private cookie: CookieService) { }


  sendLogin(credentials: any) {
    const url = `${this.authApiUrl}oauth/token`
    const body = {
      grant_type: "password",
      client_id: "1",
      client_secret: "mpILzlCpJ0PmyVI3sjvqpkWPNd47GyMYrOTKqjvH",
      username: credentials.email,
      password: credentials.password

    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json'
      })
    };
    return this.http.post(url, body, httpOptions);


  }

  registro(credentials:any) {
    const url = `${this.authApiUrl}api/v1/user`
    const body = {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      password_confirmation: credentials.password_confirmation
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json'
      })
    };
    return this.http.post(url, body, httpOptions)
  }

 
 

}
