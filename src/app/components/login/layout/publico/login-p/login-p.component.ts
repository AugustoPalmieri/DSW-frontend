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
  public myForm!: FormGroup; // Declaración del formulario reactivo

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicializar formulario reactivoSW
    this.myForm = this.fb.group({
      codigo: ['', [Validators.required]], // Campo para el código
    });
  }
  public enviarCodigo(): void {
    const email = 'hamburgueseriautn@gmail.com'; // Asegúrate de que este sea el correo registrado
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
  // Método para manejar el envío del formulario
  public submitFormulario(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); // Marca todos los campos como "tocados"
      return;
    }

    const codigo = this.myForm.value.codigo;

    // Llamar al servicio para verificar el código
    this.authService.verificarCodigo({ email: 'hamburgueseriautn@gmail.com', codigo }).subscribe(
      (response) => {
        if (response.success) {
          alert('Acceso concedido');
          this.router.navigate(['/main-menu-admin']); // Redirección al menú principal
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

  // Método para enviar el código al correo


  // Getter para facilitar el acceso a los controles del formulario
  public get f(): any {
    return this.myForm.controls;
  }
}
