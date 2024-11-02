import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {

  constructor(private toastr: ToastrService) {}

  enviarFormulario(form: any) {
    form.reset(); 
    this.toastr.success('¡Tu mensaje ha sido enviado con éxito!', 'Formulario Enviado');
  }
}
