import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ContactoService } from 'src/app/services/contacto.service'; 

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {

  constructor(private toastr: ToastrService,
    private contactoService: ContactoService
  ) {}

  enviarFormulario(form: any) {
    if (form.valid) {
      // Enviar datos al servicio
      this.contactoService.enviarFormulario(form.value).subscribe(
        (response) => {
          form.reset();
          this.toastr.success('¡Tu mensaje ha sido enviado con éxito!', 'Formulario Enviado');
        },
        (error) => {
          console.error(error);
          this.toastr.error('Hubo un error al enviar el formulario. Inténtalo nuevamente.', 'Error');
        }
      );
    } else {
      this.toastr.warning('Por favor, completa todos los campos requeridos.', 'Formulario Incompleto');
    }
  }
}