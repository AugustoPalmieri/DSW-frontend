import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/clientes/reset-password/';
  }

  sendResetCode(email: string): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}send-code`, { email })
      .pipe(
        catchError(error => {
          if (error.status === 404) {
            return throwError({ message: 'El email no está registrado' });
          }
          return throwError(error);
        })
      );
  }

  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}verify-code`, { email, code })
      .pipe(
        catchError(error => {
          if (error.status === 400 || error.status === 404) {
            return throwError({ message: 'Código inválido' });
          }
          return throwError(error);
        })
      );
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}reset`, { 
      email, 
      code, 
      newPassword 
    })
    .pipe(
      catchError(error => {
        if (error.status === 400) {
          return throwError({ message: 'Código inválido o expirado' });
        }
        if (error.status === 404) {
          return throwError({ message: 'Usuario no encontrado' });
        }
        return throwError(error);
      })
    );
  }
}