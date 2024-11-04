import { Component, OnInit } from '@angular/core';
import { Hamburguesa } from 'src/app/interfaces/hamburguesa';
import { HamburguesaService } from 'src/app/services/hamburguesa.service';
import { ListHamburguesasComponent } from '../../HAMBURGUESAS/list-hamburguesas/list-hamburguesas.component';

@Component({
  selector: 'app-add-edit-pedido',
  templateUrl: './add-edit-pedido.component.html',
  styleUrls: ['./add-edit-pedido.component.css']
})
export class AddEditPedidoComponent implements OnInit {
    hamburguesas: Hamburguesa[] = [];
    selectedHamburgers: { hamburguesa: Hamburguesa; cantidad: number }[] = [];
  
    constructor(private hamburguesaService: HamburguesaService) {}
  
    ngOnInit() {
      this.loadHamburguesas();
    }
  
    loadHamburguesas() {
      this.hamburguesaService.getListHamburguesa().subscribe(response => {
        this.hamburguesas = response.data;
      })};
    
  
    onQuantityChange(hamburguesa: Hamburguesa, cantidad: number) {
      const existing = this.selectedHamburgers.find(h => h.hamburguesa.idHamburguesa === hamburguesa.idHamburguesa);
      if (existing) {
        existing.cantidad = cantidad;
      } else {
        this.selectedHamburgers.push({ hamburguesa, cantidad });
      }
    }
  
    submitOrder() {
      const selectedHamburgers = this.hamburguesas.filter(h => h.cantidad && h.cantidad > 0);
      console.log(selectedHamburgers);
      // Aquí deberías enviar `this.selectedHamburgers` a tu backend para crear el pedido
    }
    onHamburguesasChange(hamburguesas: Hamburguesa[]): void {
      this.hamburguesas = hamburguesas;
    }
    isOrderValid(): boolean {
      return this.hamburguesas.some(hamburguesa => hamburguesa.cantidad! > 0);
    }
 
}