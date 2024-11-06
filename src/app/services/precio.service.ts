import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrecioService {
  private apiUrl = `${environment.endpoint}api/precios/actual`; 

  constructor(private http: HttpClient) {}

  getPrecioActual(idHamburguesa: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${idHamburguesa}`);
  }
}
