import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Pedido } from 'src/app/interfaces/pedido';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-list-pedidos',
  templateUrl: './list-pedidos.component.html',
  styleUrls: ['./list-pedidos.component.css']
})
export class ListPedidosComponent implements OnInit {
  listPedido: Pedido[] = []; 
  loading: boolean = false;

  constructor(private _PedidoService: PedidoService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getListPedido();
  }

  getListPedido() {
    this.loading = true;
    this._PedidoService.getListPedido().subscribe(
      (data) => {
        this.listPedido = data.data || [];
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
    this._PedidoService.deletePedido(idPedido).subscribe(() => {
      this.getListPedido();
      this.toastr.warning('El pedido ha sido eliminado con éxito', 'Pedido Eliminado');
      this.loading = false;
    });
  }
}
