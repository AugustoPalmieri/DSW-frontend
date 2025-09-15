import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ingrediente } from 'src/app/interfaces/ingrediente';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  codIngrediente: number = 0;
  operacion: string = 'Agregar ';

  constructor(
    private fb: FormBuilder,
    private _productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute
  ) {
    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      stock: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // Extraer el parámetro de la ruta
    this.codIngrediente = Number(this.aRouter.snapshot.paramMap.get('codIngrediente'));

    if (this.codIngrediente) {
      this.operacion = 'Editar ';
      this.getIngrediente(this.codIngrediente);
    }
  }

  getIngrediente(codIngrediente: number): void {
    this.loading = true;
    this._productService.getIngrediente(codIngrediente).subscribe(
      (data: Ingrediente) => {
        this.loading = false;
        this.form.setValue({
          descripcion: data.descripcion,
          stock: data.stock
        });
      },
      (error) => {
        this.loading = false;
        this.toastr.error('Error al cargar el ingrediente', 'Error');
      }
    );
  }
  checkStock() {
    const stockValue = this.form.get('stock')?.value;
    if (stockValue < 0) {
      alert('El stock no puede ser un número negativo.');
      this.form.get('stock')?.setValue('');
    }
  }

  addIngrediente(): void {
    if (this.form.invalid) return;

    const ingrediente: Ingrediente = {
      descripcion: this.form.value.descripcion,
      stock: this.form.value.stock
    };

    // Validar que la descripción no exista (solo en modo agregar)
    if (!this.codIngrediente) {
      this.loading = true;
      this._productService.getListIngredientes().subscribe({
        next: (resp) => {
          const existe = resp.data.some(i => i.descripcion.trim().toLowerCase() === ingrediente.descripcion.trim().toLowerCase());
          if (existe) {
            this.loading = false;
            this.toastr.error('Ya existe un ingrediente con esa descripción', 'Error');
            return;
          }
          // Si no existe, guardar
          this._productService.saveIngrediente(ingrediente).subscribe(
            () => {
              this.toastr.success(`El ingrediente ${ingrediente.descripcion} fue registrado con éxito`, 'Ingrediente Registrado');
              this.loading = false;
              this.router.navigate(['/listingredients']);
            },
            (error) => {
              this.loading = false;
              this.toastr.error('Error al registrar el ingrediente', 'Error');
            }
          );
        },
        error: () => {
          this.loading = false;
          this.toastr.error('Error al validar la descripción', 'Error');
        }
      });
    } else {
      ingrediente.codIngrediente = this.codIngrediente;
      this.loading = true;
      this._productService.updateIngrediente(this.codIngrediente, ingrediente).subscribe(
        () => {
          this.toastr.success(`El ingrediente ${ingrediente.descripcion} fue modificado con éxito`, 'Ingrediente Modificado');
          this.loading = false;
          this.router.navigate(['/listingredients']);
        },
        (error) => {
          this.loading = false;
          this.toastr.error('Error al modificar el ingrediente', 'Error');
        }
      );
    }
  }
}
