import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  emailForm: FormGroup;
  codeForm: FormGroup;
  passwordForm: FormGroup;
  loading: boolean = false;
  step: number = 1; // 1: email, 2: código, 3: nueva contraseña
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private resetService: ResetPasswordService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup): { mismatch: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  sendCode(): void {
    if (this.emailForm.invalid) return;
    
    this.loading = true;
    this.resetService.sendResetCode(this.emailForm.value.email).subscribe(
      () => {
        this.loading = false;
        this.step = 2;
        this.toastr.success('Código enviado a tu email', 'Éxito');
      },
      (error) => {
        this.loading = false;
        const message = error.message || 'Error al enviar el código';
        this.toastr.error(message, 'Error');
      }
    );
  }

  verifyCode(): void {
    if (this.codeForm.invalid) return;
    
    this.loading = true;
    this.resetService.verifyCode(this.emailForm.value.email, this.codeForm.value.code).subscribe(
      () => {
        this.loading = false;
        this.step = 3;
        this.toastr.success('Código verificado correctamente', 'Éxito');
      },
      (error) => {
        this.loading = false;
        const message = error.message || 'Código incorrecto';
        this.toastr.error(message, 'Error');
      }
    );
  }

  resetPassword(): void {
    if (this.passwordForm.invalid) return;
    
    this.loading = true;
    this.resetService.resetPassword(
      this.emailForm.value.email,
      this.codeForm.value.code,
      this.passwordForm.value.password
    ).subscribe(
      () => {
        this.loading = false;
        this.toastr.success('Contraseña actualizada correctamente', 'Éxito');
        this.router.navigate(['/login']);
      },
      (error) => {
        this.loading = false;
        const message = error.message || 'Error al actualizar la contraseña';
        this.toastr.error(message, 'Error');
      }
    );
  }

  goBack(): void {
    if (this.step > 1) {
      this.step--;
    } else {
      this.router.navigate(['/login']);
    }
  }
}