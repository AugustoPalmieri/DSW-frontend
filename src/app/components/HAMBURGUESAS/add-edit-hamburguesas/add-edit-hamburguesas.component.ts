import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hamburguesa } from 'src/app/interfaces/hamburguesa';
import { HamburguesaService } from 'src/app/services/hamburguesa.service';

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

  constructor(
    private fb: FormBuilder,
    private _productService: HamburguesaService,
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
    if (this.idHamburguesa) {
      this.operacion = 'Editar ';
      this.getHamburguesa(this.idHamburguesa);
      this.form.get('imagen')?.clearValidators(); 
      this.form.get('imagen')?.updateValueAndValidity(); 
    } else {
      this.form.get('imagen')?.setValidators(Validators.required); 
      this.form.get('imagen')?.updateValueAndValidity(); 
    }
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
      (error) => {
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
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
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
    if (precioValue < 0) {
      this.precioError = 'El precio no puede ser negativo';
    } else {
      this.precioError = '';
    }
  }

  addHamburguesa(): void {
    if (this.form.invalid) {
      return;
    }
  
    const hamburguesa: Hamburguesa = {
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      precio: this.form.value.precio,
      imagen: this.imagen,
    };
  
    if (this.idHamburguesa) {
      this.updateHamburguesa(hamburguesa);
    } else {
      if (!this.imagen) {
        this.toastr.error('Debe cargar una imagen para la hamburguesa', 'Error');
        return;
      }
      this.saveHamburguesa(hamburguesa);
    }
  }

  saveHamburguesa(hamburguesa: Hamburguesa): void {
    this.loading = true;
    this._productService.saveHamburguesa(hamburguesa).subscribe(
      () => {
        this.toastr.success(`La hamburguesa ${hamburguesa.nombre} fue agregada con éxito`, 'Hamburguesa Agregada');
        this.loading = false;
        this.router.navigate(['/listhamburguesas']);
      },
      (error) => {
        this.loading = false;
        this.toastr.error('Error al agregar la hamburguesa', 'Error');
      }
    );
  }

  updateHamburguesa(hamburguesa: Hamburguesa): void {
    this.loading = true;
    this._productService.updateHamburguesa(this.idHamburguesa, hamburguesa).subscribe(
      () => {
        this.toastr.success(`La hamburguesa ${hamburguesa.descripcion} fue modificada con éxito`, 'Hamburguesa Modificada');
        this.loading = false;
        this.router.navigate(['/listhamburguesas']);
      },
      (error) => {
        this.loading = false;
        this.toastr.error('Error al modificar la hamburguesa', 'Error');
      }
    );
  }
}
