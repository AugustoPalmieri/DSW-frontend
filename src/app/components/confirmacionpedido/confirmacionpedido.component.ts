import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmacionpedido',
  templateUrl: './confirmacionpedido.component.html',
  styleUrls: ['./confirmacionpedido.component.css']
})
export class ConfirmacionPedidoComponent implements OnInit {
  pedidoId: number = 0; 

  constructor(private router: Router) {}

  ngOnInit(): void {
    const pedidoIdStr = localStorage.getItem('pedidoId'); // Recuperar del localStorage
    if (pedidoIdStr) {
      this.pedidoId = Number(pedidoIdStr); // Convertir a número
      console.log('ID del pedido recuperado:', this.pedidoId); // Depuración
    } else {
      console.error('No se encontró el ID del pedido en el localStorage'); // Depuración
    }
  }

  volverAPedir(): void {
    this.router.navigate(['/cliente']);
  }
}