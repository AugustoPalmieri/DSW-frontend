import { Component, Input, OnInit,EventEmitter,Output } from '@angular/core';
import { Hamburguesa } from 'src/app/interfaces/hamburguesa'; 
import { ToastrService } from 'ngx-toastr';
import { HamburguesaService } from 'src/app/services/hamburguesa.service'; 

@Component({
  selector: 'app-list-hamburguesas',
  templateUrl: './list-hamburguesas.component.html',
  styleUrls: ['./list-hamburguesas.component.css']
})
export class ListHamburguesasComponent implements OnInit { 

  @Input () listHamburguesa: Hamburguesa[] = [];
 
  loading: boolean = false;
  @Output() listHamburguesaChange = new EventEmitter<Hamburguesa[]>(); 
  constructor(private _HamburguesaService: HamburguesaService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getListHamburguesa();
  }

  
  getListHamburguesa() {
    this.loading = true;
    this._HamburguesaService.getListHamburguesa().subscribe(
      (data) => {
        console.log('Datos recibidos desde la API:', data);
        this.listHamburguesa = data.data || [];
        console.log('Lista de hamburguesas actualizada:', this.listHamburguesa);
        this.loading = false;
      },
      (error: any) => {
        console.error('Error al obtener las hamburguesas', error);
        this.toastr.error('Error al obtener las hamburguesas', 'Error');
        this.loading = false;
      }
    );
  }
  
  onCantidadChange(hamburguesa: Hamburguesa, cantidad: number) {
    hamburguesa.cantidad = cantidad;
    this.listHamburguesaChange.emit(this.listHamburguesa);
  }


editHamburguesa(hamburguesa: Hamburguesa) {
  console.log('Editando Hamburguesa:', hamburguesa);

}
confirmDeleteHamburguesa(idHamburguesa: number): void {
  const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta hamburguesa?');
  if (confirmed) {
    this.deleteHamburguesas(idHamburguesa);
  }
}

deleteHamburguesas(idHamburguesa: number) {
  console.log('Eliminando Hamburguesa:', idHamburguesa);
  this.loading = true;
  this._HamburguesaService.deleteHamburguesa(idHamburguesa).subscribe({
      next: () => {
          this.loading = false;
          this.getListHamburguesa();
          this.toastr.warning('La hamburguesa ha sido eliminada con éxito', 'Hamburguesa Eliminada');
      },
      error: (error) => {
          this.loading = false;
          if (error.error.message === 'NO SE PUEDE ELIMINAR LA HAMBURGUESA PORQUE ESTÁ EN UN PEDIDO "EN PROCESO"') {
              this.toastr.error(error.error.message, 'Error');
          } else {
              this.toastr.error('NO SE PUEDE ELIMINAR LA HAMBURGUESA PORQUE ESTÁ EN UN PEDIDO "EN PROCESO"', 'Error');
          }
      }
  });
}



addHamburguesa() {
  console.log('Agregando nueva Hamburguesa');
  }
}