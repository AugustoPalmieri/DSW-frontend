import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Hamburguesa } from '../interfaces/hamburguesa';

@Injectable({
  providedIn: 'root'
})
export class HamburguesaService {  
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/hamburguesas/';
  }

  getListHamburguesa(): Observable<{ data: Hamburguesa[] }> {
    return this.http.get<{ data: Hamburguesa[] }>(this.myAppUrl + this.myApiUrl);
  }

  deleteHamburguesa(idHamburguesa: number): Observable<void> {
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + idHamburguesa);
  }

  saveHamburguesa(hamburguesa: Hamburguesa): Observable<void> {
    // Usar FormData para enviar el archivo junto con los otros campos
    const formData: FormData = new FormData();
    formData.append('nombre', hamburguesa.nombre);
    formData.append('descripcion', hamburguesa.descripcion);
    formData.append('precio', hamburguesa.precio?.toString() || '');
    if (hamburguesa.imagen) {
      formData.append('imagen', hamburguesa.imagen, hamburguesa.imagen.name); // Aquí se adjunta el archivo
    }

    return this.http.post<void>(this.myAppUrl + this.myApiUrl, formData);
  }

  getHamburguesa(idHamburguesa: number): Observable<Hamburguesa> {
    return this.http.get<Hamburguesa>(this.myAppUrl + this.myApiUrl + idHamburguesa);
  }

  updateHamburguesa(idHamburguesa: number, hamburguesa: Hamburguesa): Observable<void> {
    // Usar FormData para la actualización de hamburguesas con imagen
    const formData: FormData = new FormData();
    formData.append('nombre', hamburguesa.nombre);
    formData.append('descripcion', hamburguesa.descripcion);
    formData.append('precio', hamburguesa.precio?.toString() || '');
    if (hamburguesa.imagen) {
      formData.append('imagen', hamburguesa.imagen, hamburguesa.imagen.name); // Aquí se adjunta el archivo
    }

    return this.http.put<void>(this.myAppUrl + this.myApiUrl + idHamburguesa, formData);
  }
}