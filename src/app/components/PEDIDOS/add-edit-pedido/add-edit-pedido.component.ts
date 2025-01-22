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
import { Location } from '@angular/common';

interface HamburguesaPedido {
  idHamburguesa: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  imagen?:File|null;

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
  pedidoId: string | null = null;
  modalidad: string = 'TAKEAWAY';
  emailCliente: string = '';
  clienteEncontrado: boolean = false;
  buscado: boolean = false;
  isEditing: boolean = false;

  constructor(
    private hamburguesaService: HamburguesaService,
    private precioService: PrecioService,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute,
    private location: Location

  ) {}

  ngOnInit() {
    
    this.pedidoId = this.aRouter.snapshot.paramMap.get('idPedido');
    
    this.isEditing = this.pedidoId !== null;
    console.log('Modo edición:', this.isEditing, 'ID del pedido:', this.pedidoId);

    this.loadHamburguesas();

    
    if (this.isEditing && this.pedidoId) {
      this.loadPedido(parseInt(this.pedidoId, 10));
    }
  }

  loadPedido(idPedido: number) {
    this.pedidoService.getPedido(idPedido).subscribe(
      (pedido) => {
        this.modalidad = pedido.modalidad;
        this.montoTotal = pedido.montoTotal;
        this.idCliente = pedido.idCliente;
        this.selectedHamburgers = pedido.hamburguesas.map(h => ({
          idHamburguesa: h.idHamburguesa,
          nombre: h.nombre,
          descripcion: '',
          cantidad: h.cantidad,
          precio: 0
        }));

        this.calculateMontoTotal();
        this.clienteEncontrado = true;
      },
      (error) => {
        console.error('Error al cargar el pedido:', error);
        this.toastr.error('Error al cargar el pedido', 'Error');
      }
    );
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
            precio: precio ?? 0,
            imagen:h.imagen
          });
        }, error => {
          console.error(`Error al obtener el precio de la hamburguesa ${h.idHamburguesa}:`, error);
        });
      });
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

  submitOrder() {
    if (!this.isOrderValid()) {
      alert('Debe seleccionar al menos una hamburguesa con cantidad mayor a 0.');
      return;
    }
  
    if (this.idCliente === null) {
      alert('Debe seleccionar un cliente antes de crear o editar el pedido.');
      return;
    }
  
    // Agregar confirmación
    const confirmMessage = this.isEditing
      ? '¿Está seguro de que desea actualizar este pedido?'
      : '¿Está seguro de que desea crear este pedido?';
  
    if (!confirm(confirmMessage)) {
      return; // Detener la acción si el usuario cancela
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
  
    if (this.isEditing && this.pedidoId) {
      this.pedidoService.updatePedido(parseInt(this.pedidoId, 10), pedido).subscribe(
        () => {
          this.toastr.success('Pedido actualizado exitosamente', 'Éxito');
          this.router.navigate(['/listpedidos']);
        },
        (error) => {
          console.error('Error al actualizar el pedido:', error);
          this.toastr.error('Hubo un problema al actualizar el pedido', 'Error');
        }
      );
    } else {
      this.pedidoService.createPedido(pedido).subscribe(
        () => {
          this.toastr.success('Pedido creado exitosamente', 'Éxito');
          this.router.navigate(['/listpedidos']);
        },
        (error) => {
          console.error('Error al crear el pedido:', error);
          this.toastr.error('Hubo un problema al crear el pedido', 'Error');
        }
      );
    }
  }

  isOrderValid(): boolean {
    return this.selectedHamburgers.length > 0;
  }
  goBack(): void {
    this.location.back();
  }
}
