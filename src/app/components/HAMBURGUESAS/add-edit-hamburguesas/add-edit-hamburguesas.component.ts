import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hamburguesa } from 'src/app/interfaces/hamburguesa';
import { HamburguesaService } from 'src/app/services/hamburguesa.service';
import { ProductService } from 'src/app/services/product.service';
import { Ingrediente } from 'src/app/interfaces/ingrediente';

interface IngredienteSeleccionado {
  codIngrediente: number;
  descripcion: string;
  cantidad: number;
  stock: number;
}

@Component({
  selector: 'app-add-edit-hamburguesas',
  templateUrl: './add-edit-hamburguesas.component.html',
  styleUrls: ['./add-edit-hamburguesas.component.css']
})
export class AddEditHamburguesaComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  idHamburguesa: number = 0;
  operacion: string = 'Agregar ';
  precioError: string = '';
  imagen: File | null = null;
  imagenPreview: string | null = null;

  // Ingredientes
  todosLosIngredientes: Ingrediente[] = [];
  ingredientesSeleccionados: IngredienteSeleccionado[] = [];
  ingredienteAgregadoId: number | null = null;
  cantidadAgregar: number = 1;

  constructor(
    private fb: FormBuilder,
    private _productService: HamburguesaService,
    private _ingredienteService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(0)]],
      imagen: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.idHamburguesa = Number(this.aRouter.snapshot.paramMap.get('idHamburguesa'));
    this.cargarIngredientes();

    if (this.idHamburguesa) {
      this.operacion = 'Editar ';
      this.getHamburguesa(this.idHamburguesa);
      this.form.get('imagen')?.clearValidators();
      this.form.get('imagen')?.updateValueAndValidity();
      this.cargarIngredientesHamburguesa();
    } else {
      this.form.get('imagen')?.setValidators(Validators.required);
      this.form.get('imagen')?.updateValueAndValidity();
    }
  }

  cargarIngredientes() {
    this._ingredienteService.getListIngredientes().subscribe({
      next: (response) => {
        this.todosLosIngredientes = response.data;
      },
      error: () => this.toastr.error('Error al cargar ingredientes', 'Error')
    });
  }

  cargarIngredientesHamburguesa() {
    this._productService.getIngredientesHamburguesa(this.idHamburguesa).subscribe({
      next: (response) => {
        this.ingredientesSeleccionados = response.data.map((i: any) => ({
          codIngrediente: i.codIngrediente,
          descripcion: i.descripcion,
          cantidad: i.cantidad,
          stock: i.stock
        }));
      },
      error: () => this.toastr.error('Error al cargar ingredientes de la hamburguesa', 'Error')
    });
  }

  agregarIngrediente() {
    if (!this.ingredienteAgregadoId || this.cantidadAgregar < 1) {
      this.toastr.error('Seleccioná un ingrediente y una cantidad válida', 'Error');
      return;
    }

    const yaExiste = this.ingredientesSeleccionados.find(i => i.codIngrediente === this.ingredienteAgregadoId);
    if (yaExiste) {
      this.toastr.warning('Este ingrediente ya fue agregado. Modificá su cantidad directamente.', 'Atención');
      return;
    }

    const ingrediente = this.todosLosIngredientes.find(i => i.codIngrediente === Number(this.ingredienteAgregadoId));
    if (!ingrediente) return;

    this.ingredientesSeleccionados.push({
      codIngrediente: ingrediente.codIngrediente!,
      descripcion: ingrediente.descripcion,
      cantidad: this.cantidadAgregar,
      stock: ingrediente.stock
    });

    this.ingredienteAgregadoId = null;
    this.cantidadAgregar = 1;
  }

  quitarIngrediente(codIngrediente: number) {
    this.ingredientesSeleccionados = this.ingredientesSeleccionados.filter(i => i.codIngrediente !== codIngrediente);
  }

  getIngredientesNoSeleccionados(): Ingrediente[] {
    return this.todosLosIngredientes.filter(
      i => !this.ingredientesSeleccionados.find(s => s.codIngrediente === i.codIngrediente)
    );
  }

  getHamburguesa(idHamburguesa: number): void {
    this.loading = true;
    this._productService.getHamburguesa(idHamburguesa).subscribe(
      (data: Hamburguesa) => {
        this.loading = false;
        this.form.setValue({
          nombre: data.nombre,
          descripcion: data.descripcion,
          precio: data.precio || null,
          imagen: data.imagen || null
        });
      },
      () => {
        this.loading = false;
        this.toastr.error('Error al cargar la hamburguesa', 'Error');
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagen = file;
      const reader = new FileReader();
      reader.onload = () => { this.imagenPreview = reader.result as string; };
      reader.readAsDataURL(file);
      this.form.patchValue({ imagen: this.imagen });
    } else {
      this.imagen = null;
      this.imagenPreview = null;
      this.form.patchValue({ imagen: null });
    }
  }

  validatePrecio(): void {
    const precioValue = this.form.get('precio')?.value;
    this.precioError = precioValue < 0 ? 'El precio no puede ser negativo' : '';
  }

  addHamburguesa(): void {
    if (this.form.invalid) return;

    const hamburguesa: Hamburguesa = {
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      precio: this.form.value.precio,
      imagen: this.imagen,
    };

    const ingredientes = this.ingredientesSeleccionados.map(i => ({
      codIngrediente: i.codIngrediente,
      cantidad: i.cantidad
    }));

    if (this.idHamburguesa) {
      this.updateHamburguesa(hamburguesa, ingredientes);
    } else {
      if (!this.imagen) {
        this.toastr.error('Debe cargar una imagen para la hamburguesa', 'Error');
        return;
      }
      this.saveHamburguesa(hamburguesa, ingredientes);
    }
  }

  saveHamburguesa(hamburguesa: Hamburguesa, ingredientes: any[]): void {
    this.loading = true;
    this._productService.saveHamburguesa(hamburguesa, ingredientes).subscribe(
      () => {
        this.toastr.success(`La hamburguesa ${hamburguesa.nombre} fue agregada con éxito`, 'Hamburguesa Agregada');
        this.loading = false;
        this.router.navigate(['/listhamburguesas']);
      },
      () => {
        this.loading = false;
        this.toastr.error('Error al agregar la hamburguesa', 'Error');
      }
    );
  }

  updateHamburguesa(hamburguesa: Hamburguesa, ingredientes: any[]): void {
    this.loading = true;
    this._productService.updateHamburguesa(this.idHamburguesa, hamburguesa, ingredientes).subscribe(
      () => {
        this.toastr.success(`La hamburguesa ${hamburguesa.nombre} fue modificada con éxito`, 'Hamburguesa Modificada');
        this.loading = false;
        this.router.navigate(['/listhamburguesas']);
      },
      () => {
        this.loading = false;
        this.toastr.error('Error al modificar la hamburguesa', 'Error');
      }
    );
  }
}