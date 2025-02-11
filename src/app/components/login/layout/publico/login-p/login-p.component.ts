import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-p',
  templateUrl: './login-p.component.html',
  styleUrls: ['./login-p.component.css'],
})
export class LoginPComponent implements OnInit {
  public myForm!: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    this.myForm = this.fb.group({
      codigo: ['', [Validators.required]], 
    });
  }
  public enviarCodigo(): void {
    const email = 'hamburgueseriautn@gmail.com'; 
    this.authService.enviarCodigo(email).subscribe(
      (response) => {
        alert('El código ha sido enviado a tu correo.');
      },
      (error) => {
        console.error('Error al enviar el código:', error);
        alert('No se pudo enviar el código. Inténtalo más tarde.');
      }
    );
  }
  
  public submitFormulario(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); 
      return;
    }

    const codigo = this.myForm.value.codigo;

    
    this.authService.verificarCodigo({ email: 'hamburgueseriautn@gmail.com', codigo }).subscribe(
      (response) => {
        if (response.success) {
          alert('Acceso concedido');
          this.router.navigate(['/main-menu-admin']); 
        } else {
          alert('Código incorrecto');
        }
      },
      (error) => {
        console.error('Error al verificar el código:', error);
        alert('Ocurrió un error. Intenta de nuevo más tarde.');
      }
    );
  }

  

  
  public get f(): any {
    return this.myForm.controls;
  }
}
