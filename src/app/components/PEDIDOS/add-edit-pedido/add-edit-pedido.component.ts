import { Component, OnInit } from '@angular/core';
import { Hamburguesa } from 'src/app/interfaces/hamburguesa';
import { HamburguesaService } from 'src/app/services/hamburguesa.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { PrecioService } from 'src/app/services/precio.service';
import { Pedido } from 'src/app/interfaces/pedido';

interface HamburguesaPedido {
  idHamburguesa: number;
  nombre: string;
  descripcion:string;
  cantidad: number;
  precio: number;
}

@Component({
  selector: 'app-add-edit-pedido',
  templateUrl: './add-edit-pedido.component.html',
  styleUrls: ['./add-edit-pedido.component.css']
})
export class AddEditPedidoComponent implements OnInit {
  hamburguesas: HamburguesaPedido[] = [];
  selectedHamburgers: HamburguesaPedido[] = [];
  montoTotal: number = 0;
  idCliente: number = 1; // valor fijo, hay q hacerlo dinamico

  constructor(
    private hamburguesaService: HamburguesaService,
    private precioService: PrecioService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit() {
    this.loadHamburguesas();
  }

  loadHamburguesas() {
    this.hamburguesaService.getListHamburguesa().subscribe(response => {
      response.data.forEach((h: Hamburguesa) => {
        this.precioService.getPrecioActual(h.idHamburguesa ?? 0).subscribe(precio => {
          this.hamburguesas.push({
            idHamburguesa: h.idHamburguesa ?? 0,
            descripcion:h.descripcion,
            nombre: h.nombre,
            cantidad: 0,
            precio: precio ?? 0
          });
        }, error => {
          console.error(`Error al obtener el precio de la hamburguesa ${h.idHamburguesa}:`, error);
        });
      });
      console.log("Hamburguesas cargadas:", this.hamburguesas);  
    }, error => {
      console.error('Error al cargar las hamburguesas:', error);
    });
  }
  onQuantityChange(hamburguesa: HamburguesaPedido, cantidad: number) {
    hamburguesa.cantidad = cantidad;
    this.updateSelectedHamburgers();
  }

  updateSelectedHamburgers() {
    this.selectedHamburgers = this.hamburguesas.filter(h => h.cantidad > 0);
    this.calculateMontoTotal();
  }

  calculateMontoTotal() {
    this.montoTotal = this.selectedHamburgers.reduce((total, h) => total + h.precio * h.cantidad, 0);
  }

  submitOrder() {
    if (!this.isOrderValid()) {
      alert('Debe seleccionar al menos una hamburguesa con cantidad mayor a 0.');
      return;
    }

    const pedido: Pedido = {
      modalidad: 'presencial', // O 'online', según tu lógica
      montoTotal: this.montoTotal,
      estado: 'EN PROCESO',
      idCliente: this.idCliente,
      hamburguesas: this.selectedHamburgers.map(h => ({
        idHamburguesa: h.idHamburguesa,
        nombre: h.nombre,
        cantidad: h.cantidad
      }))
    };

    this.pedidoService.createPedido(pedido).subscribe(
      response => {
        alert('Pedido creado exitosamente');
        this.resetForm();
      },
      error => {
        console.error('Error al crear el pedido:', error);
        alert('Hubo un problema al crear el pedido');
      }
    );
  }

  isOrderValid(): boolean {
    return this.selectedHamburgers.length > 0;
  }

  resetForm() {
    this.hamburguesas.forEach(h => h.cantidad = 0);
    this.selectedHamburgers = [];
    this.montoTotal = 0;
  }
}