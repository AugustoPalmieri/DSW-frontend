import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeliveryService } from 'src/app/services/delivery.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  deliveryActual: { valor: number; fecha: string } | null = null;
  form: FormGroup;
  loading = false;

  constructor(
    private deliveryService: DeliveryService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      valor: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.obtenerDeliveryActual();
  }

  obtenerDeliveryActual() {
    this.loading = true;
    this.deliveryService.getDelivery().subscribe({
      next: (data) => {
        console.log('Respuesta backend GET /api/delivery:', data);
        if (data && typeof data.valor === 'number') {
          this.deliveryActual = data;
        } else {
          this.deliveryActual = null;
        }
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Error al obtener el valor de delivery', 'Error');
        this.deliveryActual = null;
        this.loading = false;
      }
    });
  }

  actualizarDelivery() {
    if (this.form.invalid) return;
    this.loading = true;
    const valor = this.form.value.valor;
    this.deliveryService.setDelivery({ valor }).subscribe({
      next: (resp) => {
        console.log('Respuesta backend POST /api/delivery:', resp);
        this.toastr.success('Valor de delivery actualizado', 'Éxito');
        this.obtenerDeliveryActual();
        this.form.reset();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error backend POST /api/delivery:', err);
        this.toastr.error('Error al actualizar el valor de delivery', 'Error');
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/main-menu-admin']);
  }
}
