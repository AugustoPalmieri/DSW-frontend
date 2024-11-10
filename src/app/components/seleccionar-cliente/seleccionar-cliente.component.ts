import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/interfaces/cliente';

@Component({
  selector: 'app-seleccionar-cliente',
  templateUrl: './seleccionar-cliente.component.html',
  styleUrls: ['./seleccionar-cliente.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SeleccionarClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  @Output() clienteSeleccionado = new EventEmitter<number>(); 

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.getListCliente().subscribe(response => {
      this.clientes = response.data;
    }, error => {
      console.error('Error al cargar los clientes:', error);
    });
  }
  clientesSeleccionados: number | null = null;

seleccionarCliente(idCliente: number) {
  this.clientesSeleccionados = idCliente;
  this.clienteSeleccionado.emit(idCliente);
}


  
  
  
}
