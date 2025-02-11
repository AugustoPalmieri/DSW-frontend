import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {  
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl= environment.endpoint
    this. myApiUrl = 'api/clientes/'

   }
   getListCliente(): Observable<{ data: Cliente[] }> {
    return this.http.get<{ data: Cliente[] }>(this.myAppUrl + this.myApiUrl);
  }
  
  deleteCliente(idCliente: number): Observable<void>{
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + idCliente)
  }
  
  saveCliente(cliente:Cliente):  Observable<void>{
    return this.http.post<void>(this.myAppUrl + this.myApiUrl , cliente)

  }
  getCliente(idCliente: number): Observable<Cliente>{
    return this.http.get<Cliente>(this.myAppUrl + this.myApiUrl + idCliente)
  }
  updateCliente(idCliente: number, cliente: Cliente): Observable<void>{
    return this.http.put<void>(this.myAppUrl + this.myApiUrl +idCliente, cliente)
  }
  findByEmail(email: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.myAppUrl}${this.myApiUrl}email/${email}`);
  }
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}login`, body);
  }
  
}
