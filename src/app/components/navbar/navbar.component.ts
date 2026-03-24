import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from 'src/app/services/autenticacion.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: AutenticacionService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('token');
    this.router.navigate(['/menu']);
  }
}