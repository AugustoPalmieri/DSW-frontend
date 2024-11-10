// add-edit-pedido.component.ts
import { Component, OnInit } from '@angular/core';
import { Hamburguesa } from 'src/app/interfaces/hamburguesa';
import { HamburguesaService } from 'src/app/services/hamburguesa.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { PrecioService } from 'src/app/services/precio.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/interfaces/cliente';
import { Pedido } from 'src/app/interfaces/pedido';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



interface HamburguesaPedido {
  idHamburguesa: number;
  nombre: string;
  descripcion: string;
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
  idCliente: number | null = null;
  modalidad: string = 'TAKEAWAY';
  emailCliente: string = '';
  clienteEncontrado: boolean = false;
  buscado: boolean = false;

  constructor(
    private hamburguesaService: HamburguesaService,
    private precioService: PrecioService,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute
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
            descripcion: h.descripcion,
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

  buscarClientePorEmail() {
    if (this.emailCliente) {
      this.buscado = true;
      this.clienteService.findByEmail(this.emailCliente).subscribe(
        cliente => {
          this.idCliente = cliente.idCliente ?? null;
          console.log(`ID de cliente encontrado: ${this.idCliente}`);
          this.clienteEncontrado = true;
        },
        error => {
          console.error('Error al buscar cliente por email:', error);
          alert('No se encontró un cliente con ese email');
        }
      );
    } else {
      alert('Ingrese un email válido');
    }
  }

  setCliente(idCliente: number): void {
    if (idCliente) {
      console.log(`ID de cliente recibido: ${idCliente}`);
      this.idCliente = idCliente;
    } else {
      console.log('Ningún cliente seleccionado.');
    }
  }

  submitOrder() {
    if (!this.isOrderValid()) {
      alert('Debe seleccionar al menos una hamburguesa con cantidad mayor a 0.');
      return;
    }

    if (this.idCliente === null) {
      alert('Debe seleccionar un cliente antes de crear el pedido.');
      return;
    }

    const pedido: Pedido = {
      modalidad: this.modalidad,
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
    this.emailCliente = '';
    this.idCliente = null;
  }
}
