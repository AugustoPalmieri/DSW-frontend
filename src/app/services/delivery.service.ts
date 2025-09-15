import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private myAppUrl = environment.endpoint;
  private myApiUrl = 'api/delivery';

  constructor(private http: HttpClient) {}

  getDelivery(): Observable<{ valor: number; fecha: string } | null> {
    return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}`).pipe(
      // Adaptar la respuesta del backend al formato esperado por el frontend
      map(resp => {
        if (resp && resp.data) {
          return {
            valor: Number(resp.data.precio),
            fecha: resp.data.fechaActualizacion
          };
        }
        return null;
      })
    );
  }

  setDelivery(data: { valor: number }): Observable<void> {
    // El backend espera el campo 'precio', no 'valor'
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, { precio: data.valor });
  }
}
