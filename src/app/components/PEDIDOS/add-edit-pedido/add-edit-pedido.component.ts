import { Component, OnInit } from '@angular/core';
import { Hamburguesa } from 'src/app/interfaces/hamburguesa';
import { HamburguesaService } from 'src/app/services/hamburguesa.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { PrecioService } from 'src/app/services/precio.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/interfaces/cliente';
import { Pedido } from 'src/app/interfaces/pedido';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryService } from 'src/app/services/delivery.service';
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
  passwordCliente: string = ''; 
  token: string | null = null; 
  clienteEncontrado: boolean = false;
  buscado: boolean = false;
  isEditing: boolean = false;

  deliveryValor: number = 0;

  constructor(
    private hamburguesaService: HamburguesaService,
    private precioService: PrecioService,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private deliveryService: DeliveryService,
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
    this.obtenerValorDelivery();
    if (this.isEditing && this.pedidoId) {
      this.loadPedido(parseInt(this.pedidoId, 10));
    }
  }

  obtenerValorDelivery() {
    this.deliveryService.getDelivery().subscribe({
      next: (data) => {
        this.deliveryValor = data && data.valor ? data.valor : 0;
      },
      error: () => {
        this.deliveryValor = 0;
      }
    });
  }
  showRegisterForm: boolean = false;

toggleRegisterForm(): void {
  this.showRegisterForm = !this.showRegisterForm;
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
    let total = this.selectedHamburgers.reduce((sum, h) => sum + h.precio * h.cantidad, 0);
    if (this.modalidad === 'DELIVERY') {
      total += this.deliveryValor;
    }
    this.montoTotal = total;
  }
  
  loginCliente() {
    if (!this.emailCliente.trim() || !this.passwordCliente.trim()) {
        this.toastr.error('Debe ingresar un email y contraseña válidos', 'Error');
        return;
    }

    this.clienteService.login(this.emailCliente, this.passwordCliente).subscribe(
        (response) => {
            console.log('Respuesta del servidor:', response);

            if (response && response.token && response.cliente?.idCliente) {
                this.token = response.token; 
                this.idCliente = response.cliente.idCliente; 
                this.clienteEncontrado = true;
                this.toastr.success('Cliente autenticado exitosamente', 'Éxito');
            } else {
                this.clienteEncontrado = false;
                this.toastr.error('Respuesta inesperada del servidor', 'Error');
            }
        },
        (error) => {
            console.error('Error al iniciar sesión:', error);
            this.clienteEncontrado = false;
            this.toastr.error('Credenciales inválidas', 'Error');
        }
    );
}





  submitOrder() {
    if (!this.clienteEncontrado || !this.idCliente) {
        this.toastr.error('Debe iniciar sesión antes de crear o editar el pedido.', 'Error');
        return;
    }

    if (!this.isOrderValid()) {
        this.toastr.error('Debe seleccionar al menos una hamburguesa con cantidad mayor a 0.', 'Error');
        return;
    }

    if (!this.modalidad.trim()) {
        this.toastr.error('Debe seleccionar una modalidad válida.', 'Error');
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

    if (this.isEditing && this.pedidoId) {
        this.actualizarPedido(pedido);
    } else {
        this.crearPedido(pedido);
    }
}

private actualizarPedido(pedido: Pedido) {
  this.pedidoService.updatePedido(parseInt(this.pedidoId!, 10), pedido).subscribe(
      () => {
          this.toastr.success('Pedido actualizado exitosamente', 'Éxito');
          this.router.navigate(['/listpedidos']);
      },
      (error) => {
          console.error('Error al actualizar el pedido:', error);
          this.toastr.error('Hubo un problema al actualizar el pedido', 'Error');
      }
  );
}

private crearPedido(pedido: Pedido) {
  this.pedidoService.createPedido(pedido).subscribe(
      (response: any) => {
          console.log('Respuesta completa del servidor:', response); 
          if (response && response.data && response.data.idPedido) { 
              const pedidoId = response.data.idPedido;
              console.log('ID del pedido obtenido:', pedidoId); 
              localStorage.setItem('pedidoId', pedidoId.toString());
              this.toastr.success('Pedido creado exitosamente', 'Éxito');
              this.router.navigate(['/confirmacionpedido']);
          } else {
              console.error('No se encontró el ID del pedido en la respuesta:', response); 
              this.toastr.error('No se pudo obtener el ID del pedido del servidor', 'Error');
          }
      },
      (error) => {
          console.error('Error al crear el pedido:', error);
          this.toastr.error('Hubo un problema al crear el pedido', 'Error');
      }
  );
}


  isOrderValid(): boolean {
    return this.selectedHamburgers.length > 0;
  }
  goBack(): void {
    this.location.back();
  }


}
