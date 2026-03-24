import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-p',
  templateUrl: './login-p.component.html',
  styleUrls: ['./login-p.component.css'],
})
export class LoginPComponent implements OnInit {
  public myForm!: FormGroup;
  public loading: boolean = false;
  public mensajeCarga: string = 'Procesando...';
  public codigoEnviado: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.authService.getAuthenticated()) {
      this.router.navigate(['/main-menu-admin']);
      return;
    }

    this.myForm = this.fb.group({
      codigo: ['', [Validators.required]],
    });
  }

  public enviarCodigo(): void {
    this.mensajeCarga = 'Enviando código al correo del administrador...';
    this.loading = true;
    const email = 'hamburgueseriautn@gmail.com';
    this.authService.enviarCodigo(email).subscribe(
      () => {
        this.loading = false;
        this.codigoEnviado = true;
        this.toastr.success('Código enviado al correo del administrador', 'Éxito');
      },
      (error) => {
        this.loading = false;
        console.error('Error al enviar el código:', error);
        this.toastr.error('No se pudo enviar el código. Inténtalo más tarde.', 'Error');
      }
    );
  }

  public submitFormulario(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.mensajeCarga = 'Verificando código...';
    this.loading = true;
    const codigo = this.myForm.value.codigo;

    this.authService.verificarCodigo({ email: 'hamburgueseriautn@gmail.com', codigo }).subscribe(
      (response) => {
        if (response.success) {
          this.authService.setAuthenticated(true);
          this.authService.setAdminToken(response.token);
          this.loading = false;
          this.toastr.success('Acceso concedido', 'Bienvenido');
          this.router.navigate(['/main-menu-admin']);
        } else {
          this.loading = false;
          this.toastr.error('Código incorrecto', 'Error');
        }
      },
      (error) => {
        this.loading = false;
        console.error('Error al verificar el código:', error);
        this.toastr.error('Ocurrió un error. Intenta de nuevo más tarde.', 'Error');
      }
    );
  }

  public get f(): any {
    return this.myForm.controls;
  }

  public goBack(): void {
    this.router.navigate(['/menu']);
  }
}