import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../services/autenticacion.service';
import { ClienteService } from '../services/cliente.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AutenticacionService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const adminToken = this.authService.getAdminToken();
    if (adminToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${adminToken}`)
      });
      return next.handle(cloned);
    }

    
    const clienteToken = localStorage.getItem('token');
    if (clienteToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${clienteToken}`)
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}