import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { Location } from '@angular/common';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-add-edit-clientes',
  templateUrl: './add-edit-clientes.component.html',
  styleUrls: ['./add-edit-clientes.component.css']
})
export class AddEditClientesComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  idCliente: number = 0;
  operacion: string = 'Agregar ';
  mostrarNavbarCliente: boolean = false;

  
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private _productService: ClienteService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute,
    private navigationService: NavigationService,
    private location: Location,
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.idCliente = Number(this.aRouter.snapshot.paramMap.get('idCliente'));
    if (this.idCliente) {
      this.operacion = 'Editar ';
      this.getCliente(this.idCliente);
    }

    const previousUrl = this.navigationService.getPreviousUrl();
    if (previousUrl === '/listclientes') {
      this.mostrarNavbarCliente = false;
    } else {
      this.mostrarNavbarCliente = true;
    }
  }

  
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  
  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  
  passwordMatchValidator(form: FormGroup): { mismatch: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  getCliente(idCliente: number): void {
    this.loading = true;
    this._productService.getCliente(idCliente).subscribe(
      (data: Cliente) => {
        this.loading = false;
        this.form.setValue({
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          email: data.email,
          direccion: data.direccion,
          password: '',
          confirmPassword: ''
        });
      },
      (error) => {
        this.loading = false;
        this.toastr.error('Error al cargar el Cliente', 'Error');
      }
    );
  }

  addCliente(): void {
    if (this.form.invalid) return;

    const cliente: Cliente = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      telefono: this.form.value.telefono,
      email: this.form.value.email,
      direccion: this.form.value.direccion,
      password: this.form.value.password,
    };

    if (this.idCliente) {
      cliente.idCliente = this.idCliente;
      this.loading = true;
      this._productService.updateCliente(this.idCliente, cliente).subscribe(
        () => {
          this.toastr.success(`El cliente ${cliente.nombre} ${cliente.apellido} fue modificado con éxito`, 'Cliente Modificado');
          this.loading = false;
          this.router.navigate(['/listclientes']);
        },
        (error) => {
          this.loading = false;
          this.toastr.error('Error al modificar el cliente', 'Error');
        }
      );
    } else {
      this.loading = true;
      this._productService.saveCliente(cliente).subscribe(
        () => {
          this.toastr.success(`El cliente ${cliente.nombre} ${cliente.apellido} fue registrado con éxito`, 'Cliente Registrado');
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.toastr.error('Error al registrar el cliente', 'Error');
        }
      );
    }
  }

  goBack(): void {
    this.location.back();
  }
}