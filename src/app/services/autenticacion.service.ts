import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private apiUrl = 'http://localhost:3000/api/admin'; 

  constructor(private http: HttpClient) {}

  enviarCodigo(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviar-codigo`, { email });
  }

  verificarCodigo(data: { email: string; codigo: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/verificar-codigo`, data);
  }
}
