import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Pedido } from 'src/app/interfaces/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';


@Component({
  selector: 'app-list-pedidos',
  templateUrl: './list-pedidos.component.html',
  styleUrls: ['./list-pedidos.component.css']
})
export class ListPedidosComponent implements OnInit {
  listPedido: Pedido[] = []; 
  loading: boolean = false;
  

  constructor(private _PedidoService: PedidoService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.getListPedido();
  }

  getListPedido() {
    this.loading = true;
    this._PedidoService.getListPedido().subscribe(
      (data) => {
        this.listPedido = data.data || [];
        this.listPedido.sort((a, b) => b.idPedido! - a.idPedido!); 
        this.loading = false;
      },
      (error: any) => {
        console.error('Error al obtener los pedidos', error);
        this.toastr.error('Error al obtener los pedidos', 'Error');
        this.loading = false;
      }
    );
  }

  deletePedido(idPedido: number) {
    this.loading = true;
    this._PedidoService.deletePedido(idPedido).subscribe({
      next: () => {
        this.getListPedido();
        this.toastr.warning('El pedido ha sido eliminado con éxito', 'Pedido Eliminado');
        this.loading = false;
      },
      error: (error) => {
        if (error.error.message === 'No se puede eliminar un pedido en proceso') {
          this.toastr.info('No se puede eliminar un pedido que no está en estado ENTREGADO', 'Aviso');
        } else {
          this.toastr.error('Error al eliminar el pedido', 'Error');
        }
        this.loading = false;
      }
    });
  }
  actualizarEstado(idPedido: number, estado: string): void {
    this._PedidoService.updateEstado(idPedido, estado).subscribe(
      (response) => {
        this.toastr.success('Estado del pedido actualizado', 'Éxito');
        console.log('Estado actualizado:', response);
  
        // Buscar el pedido en la lista y actualizar su estado
        const pedido = this.listPedido.find(p => p.idPedido === idPedido);
        if (pedido) {
          pedido.estado = estado;  // Actualizar el estado localmente
        }
  
        // Aquí Angular detectará los cambios y solo actualizará la fila de este pedido.
      },
      (error) => {
        this.toastr.error('Error al actualizar el estado', 'Error');
        console.error('Error al actualizar el estado', error);
      }
    );
  }
}



