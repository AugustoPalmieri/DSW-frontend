import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Ingrediente } from 'src/app/interfaces/ingrediente';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {

  listProducts: Ingrediente[] = [];
  loading: boolean = false;

  constructor(private _productService: ProductService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getListIngredientes();
  }

  getListIngredientes() {
    this.loading = true;
    this._productService.getListIngredientes().subscribe((data) => {
        console.log('Datos recibidos desde la API:', data); 
        this.listProducts = data.data; 
        console.log('Lista de productos actualizada:', this.listProducts);
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los ingredientes', error);
      }
    );
  }

  editIngrediente(ingrediente: Ingrediente) {
    console.log('Editando ingrediente:', ingrediente);
  }

  confirmDeleteIngrediente(codIngrediente: number): void {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este ingrediente?');
    if (confirmed) {
      this.deleteIngrediente(codIngrediente);
    }
  }

  deleteIngrediente(codIngrediente: number) {
    console.log('Eliminando ingrediente:', codIngrediente);
    this.loading = true;
    this._productService.deleteIngrediente(codIngrediente).subscribe(
      () => {
        this.loading = false;
        this.getListIngredientes();
        this.toastr.warning('El ingrediente ha sido eliminado con éxito', 'Ingrediente Eliminado');
      },
      (error) => {
        this.loading = false;
        if (error.error && error.error.hamburguesas) {
          const hamburguesas = error.error.hamburguesas.join(', ');
          this.toastr.error(`DEBE ELIMINAR PRIMERO LA(S) HAMBURGUESA(S) QUE UTILIZA(N) EL INGREDIENTE: ${hamburguesas}`, 'Error');
        } else {
          this.toastr.error('Error al eliminar el ingrediente', 'Error');
        }
      }
    );
  }

  addIngrediente() {
    console.log('Agregando nuevo ingrediente');
  }
}
