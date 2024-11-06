import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pedido } from '../interfaces/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/pedidos/';
  }

  getListPedido(): Observable<{ data: Pedido[] }> {
    return this.http.get<{ data: Pedido[] }>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  createPedido(pedido: Pedido): Observable<any> {
  return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, pedido); 
}

  deletePedido(idPedido: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${idPedido}`);
  }

  savePedido(pedido: Pedido): Observable<Pedido> {  
    return this.http.post<Pedido>(`${this.myAppUrl}${this.myApiUrl}`, pedido);
  }

  getPedido(idPedido: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.myAppUrl}${this.myApiUrl}${idPedido}`);
  }

  updatePedido(idPedido: number, pedido: Pedido): Observable<Pedido> {  
    return this.http.put<Pedido>(`${this.myAppUrl}${this.myApiUrl}${idPedido}`, pedido);
  }
  updateEstado(idPedido: number, estado: string): Observable<any> {
    const estadoData = { estado };  // Enviamos solo el estado en el cuerpo de la solicitud
    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl}${idPedido}/estado`, estadoData);

  }

}