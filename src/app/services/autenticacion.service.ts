import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private apiUrl = 'http://localhost:3000/api/admin';
  private isAuthenticated = false;

  constructor(private http: HttpClient) {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      this.isAuthenticated = true;
    }
  }

  enviarCodigo(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviar-codigo`, { email });
  }

  verificarCodigo(data: { email: string; codigo: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/verificar-codigo`, data);
  }

  setAuthenticated(status: boolean): void {
    this.isAuthenticated = status;
  }

  getAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  setAdminToken(token: string): void {
    sessionStorage.setItem('adminToken', token);
  }

  getAdminToken(): string | null {
    return sessionStorage.getItem('adminToken');
  }

  logout(): void {
    this.isAuthenticated = false;
    sessionStorage.removeItem('adminToken');
  }
}