import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { ListProductsComponent } from './components/INGREDIENTES/list-products/list-products.component';
import { AddEditProductComponent } from './components/INGREDIENTES/add-edit-product/add-edit-product.component';
import { ListHamburguesasComponent } from './components/HAMBURGUESAS/list-hamburguesas/list-hamburguesas.component';
import { AddEditHamburguesaComponent } from './components/HAMBURGUESAS/add-edit-hamburguesas/add-edit-hamburguesas.component';
import { SelectUserComponent } from './components/select-user/select-user.component';
import { ClientePrincipalComponent } from './components/cliente-principal/cliente-principal.component';
import { LoginPComponent } from './components/login/layout/publico/login-p/login-p.component';
import { MainMenuAdminComponent } from './components/main-menu-admin/main-menu-admin.component';
import { AddEditClientesComponent } from './components/CLIENTES/add-edit-clientes/add-edit-clientes.component';
import { ListClientesComponent } from './components/CLIENTES/list-clientes/list-clientes.component';
import { ListPedidosComponent } from './components/PEDIDOS/list-pedidos/list-pedidos.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { AddEditPedidoComponent } from './components/PEDIDOS/add-edit-pedido/add-edit-pedido.component';
import { ConfirmacionPedidoComponent } from './components/confirmacionpedido/confirmacionpedido.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';


const routes: Routes = [
  { path: 'admin-delivery', component: DeliveryComponent },
  { path: 'menu', component: SelectUserComponent },
  {path:'cliente',component:ClientePrincipalComponent },
  {path:'admin-login',component:LoginPComponent},
  {path:'reset-password',component:ResetPasswordComponent},
  {path:'main-menu-admin',component:MainMenuAdminComponent},
  { path: 'contacto', component: ContactoComponent },
  { path: 'nosotros', component: NosotrosComponent},
  // Ingredientes
  { path: 'listingredients', component: ListProductsComponent },
  { path: 'listingredients/add', component: AddEditProductComponent },
  { path: 'listingredients/edit/:codIngrediente', component: AddEditProductComponent },
  // Hamburguesas
  { path: 'listhamburguesas', component: ListHamburguesasComponent },
  { path: 'listhamburguesas/add', component: AddEditHamburguesaComponent },
  { path: 'listhamburguesas/edit/:idHamburguesa', component: AddEditHamburguesaComponent },
   // Clientes
   { path: 'listclientes', component: ListClientesComponent },
   { path: 'listclientes/add', component: AddEditClientesComponent },
   { path: 'listclientes/edit/:idCliente', component: AddEditClientesComponent },
   //Pedidos
   {path: 'listpedidos',component:ListPedidosComponent},
   {path: 'listpedidos/add',component:AddEditPedidoComponent},
   { path: 'listpedidos/edit/:idPedido', component: AddEditPedidoComponent },
    {path:'confirmacionpedido',component: ConfirmacionPedidoComponent},
  //delivery
  // { path: 'admin-delivery', component: DeliveryComponent },
  // Ruta comodín
  { path: '**', redirectTo: 'menu', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule {} 
