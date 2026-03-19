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
import { AutenticacionService } from 'src/app/services/autenticacion.service';

interface HamburguesaPedido {
  idHamburguesa: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  imagen?: File | null;
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
  showRegisterForm: boolean = false;

  // Admin
  isAdmin: boolean = false;
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  busquedaCliente: string = '';
  clienteSeleccionado: Cliente | null = null;
  mostrarDropdown: boolean = false;

  // Registro rápido
  mostrarFormRapido: boolean = false;
  nombreRapido: string = '';
  apellidoRapido: string = '';
  telefonoRapido: string = '';

  constructor(
    private hamburguesaService: HamburguesaService,
    private precioService: PrecioService,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private deliveryService: DeliveryService,
    private authService: AutenticacionService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.pedidoId = this.aRouter.snapshot.paramMap.get('idPedido');
    this.isEditing = this.pedidoId !== null;
    this.loadHamburguesas();
    this.obtenerValorDelivery();

    if (this.authService.getAuthenticated()) {
      this.isAdmin = true;
      this.clienteEncontrado = false;
      this.cargarClientes();
    }

    if (this.isEditing && this.pedidoId) {
      this.loadPedido(parseInt(this.pedidoId, 10));
    }
  }

  // ── ADMIN: cargar y filtrar clientes ─────────────────────────────────────

  cargarClientes() {
    this.clienteService.getListCliente().subscribe({
      next: (response) => {
        this.clientes = response.data;
        this.clientesFiltrados = response.data;
      },
      error: () => this.toastr.error('Error al cargar clientes', 'Error')
    });
  }

  filtrarClientes() {
    const termino = this.busquedaCliente.toLowerCase().trim();
    if (!termino) {
      this.clientesFiltrados = this.clientes;
    } else {
      this.clientesFiltrados = this.clientes.filter(c =>
        (c.email ?? '').toLowerCase().includes(termino) ||
        c.idCliente?.toString().includes(termino) ||
        c.nombre.toLowerCase().includes(termino) ||
        c.apellido.toLowerCase().includes(termino)
      );
    }
    this.mostrarDropdown = true;
  }

  seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.idCliente = cliente.idCliente ?? null;
    this.busquedaCliente = `#${cliente.idCliente} — ${cliente.nombre} ${cliente.apellido}${cliente.email ? ' (' + cliente.email + ')' : ''}`;
    this.clienteEncontrado = true;
    this.mostrarDropdown = false;
    this.mostrarFormRapido = false;
  }

  limpiarSeleccion() {
    this.clienteSeleccionado = null;
    this.idCliente = null;
    this.busquedaCliente = '';
    this.clienteEncontrado = false;
    this.clientesFiltrados = this.clientes;
  }

  // ── ADMIN: registro rápido ────────────────────────────────────────────────

  toggleFormRapido() {
    this.mostrarFormRapido = !this.mostrarFormRapido;
    this.nombreRapido = '';
    this.apellidoRapido = '';
    this.telefonoRapido = '';
  }

  registrarClienteRapido() {
    if (!this.nombreRapido.trim() || !this.apellidoRapido.trim() || !this.telefonoRapido.trim()) {
      this.toastr.error('Nombre, apellido y teléfono son obligatorios', 'Error');
      return;
    }

    this.clienteService.registroRapido({
      nombre: this.nombreRapido,
      apellido: this.apellidoRapido,
      telefono: this.telefonoRapido
    }).subscribe({
      next: (response) => {
        const cliente = response.data;
        this.toastr.success(`Cliente ${cliente.nombre} ${cliente.apellido} registrado`, 'Éxito');
        this.seleccionarCliente(cliente);
        this.mostrarFormRapido = false;
        this.cargarClientes();
      },
      error: () => this.toastr.error('Error al registrar el cliente', 'Error')
    });
  }

  // ── CLIENTE: login normal ─────────────────────────────────────────────────

  loginCliente() {
    if (!this.emailCliente.trim() || !this.passwordCliente.trim()) {
      this.toastr.error('Debe ingresar un email y contraseña válidos', 'Error');
      return;
    }

    this.clienteService.login(this.emailCliente, this.passwordCliente).subscribe({
      next: (response) => {
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
      error: () => {
        this.clienteEncontrado = false;
        this.toastr.error('Credenciales inválidas', 'Error');
      }
    });
  }

  toggleRegisterForm(): void {
    this.showRegisterForm = !this.showRegisterForm;
  }

  // ── Pedido ────────────────────────────────────────────────────────────────

  obtenerValorDelivery() {
    this.deliveryService.getDelivery().subscribe({
      next: (data) => {
        this.deliveryValor = data && data.valor ? data.valor : 0;
      },
      error: () => { this.deliveryValor = 0; }
    });
  }

  loadPedido(idPedido: number) {
    this.pedidoService.getPedido(idPedido).subscribe({
      next: (pedido) => {
        this.modalidad = pedido.modalidad;
        this.montoTotal = pedido.montoTotal;
        this.idCliente = pedido.idCliente;
        this.selectedHamburgers = pedido.hamburguesas.map((h: any) => ({
          idHamburguesa: h.idHamburguesa,
          nombre: h.nombre,
          descripcion: '',
          cantidad: h.cantidad,
          precio: 0
        }));
        this.calculateMontoTotal();
        this.clienteEncontrado = true;
      },
      error: () => this.toastr.error('Error al cargar el pedido', 'Error')
    });
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
            imagen: h.imagen
          });
        });
      });
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
    if (this.modalidad === 'DELIVERY') total += this.deliveryValor;
    this.montoTotal = total;
  }

  submitOrder() {
    if (!this.clienteEncontrado || !this.idCliente) {
      this.toastr.error('Debe seleccionar o autenticar un cliente antes de crear el pedido.', 'Error');
      return;
    }
    if (!this.isOrderValid()) {
      this.toastr.error('Debe seleccionar al menos una hamburguesa.', 'Error');
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
    this.pedidoService.updatePedido(parseInt(this.pedidoId!, 10), pedido).subscribe({
      next: () => {
        this.toastr.success('Pedido actualizado exitosamente', 'Éxito');
        this.router.navigate(['/listpedidos']);
      },
      error: () => this.toastr.error('Hubo un problema al actualizar el pedido', 'Error')
    });
  }

  private crearPedido(pedido: Pedido) {
  this.pedidoService.createPedido(pedido).subscribe({
    next: (response: any) => {
      if (response && response.data && response.data.idPedido) {
        localStorage.setItem('pedidoId', response.data.idPedido.toString());
        this.toastr.success('Pedido creado exitosamente', 'Éxito');
        this.isAdmin
          ? this.router.navigate(['/listpedidos'])
          : this.router.navigate(['/confirmacionpedido']);
      } else {
        this.toastr.error('No se pudo obtener el ID del pedido', 'Error');
      }
    },
    error: (err) => {
      const mensajeBackend = err?.error?.message || '';
      if (mensajeBackend.toLowerCase().includes('stock insuficiente')) {
        this.toastr.error(
          mensajeBackend,
          'El pedido no se puede realizar',
          { timeOut: 8000 }
        );
      } else {
        this.toastr.error('Hubo un problema al crear el pedido', 'Error');
      }
    }
  });
}

  isOrderValid(): boolean {
    return this.selectedHamburgers.length > 0;
  }

  goBack(): void {
    this.location.back();
  }
}