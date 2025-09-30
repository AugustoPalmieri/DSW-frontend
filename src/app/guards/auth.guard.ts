import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AutenticacionService } from '../services/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AutenticacionService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.getAuthenticated()) {
      return true;
    }
    
    this.router.navigate(['/admin-login']);
    return false;
  }
}