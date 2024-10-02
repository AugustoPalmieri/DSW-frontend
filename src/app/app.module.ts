import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



//Modules
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

//componentes
import { NavbarComponent } from './components/navbar/navbar.component';
import { ListProductsComponent } from './components/INGREDIENTES/list-products/list-products.component';
import { AddEditProductComponent } from './components/INGREDIENTES/add-edit-product/add-edit-product.component';
import { ProgressBarComponent } from './shared/progress-bar/progress-bar.component';
import { ListHamburguesasComponent } from './components/HAMBURGUESAS/list-hamburguesas/list-hamburguesas.component';
import { AddEditHamburguesaComponent } from './components/HAMBURGUESAS/add-edit-hamburguesas/add-edit-hamburguesas.component';
import { LoginPComponent } from './components/login/layout/publico/login-p/login-p.component';
import { ClientePrincipalComponent } from './components/cliente-principal/cliente-principal.component';
import { SelectUserComponent } from './components/select-user/select-user.component';
import { MainMenuAdminComponent } from './components/main-menu-admin/main-menu-admin.component';
import { AddEditClientesComponent } from './components/CLIENTES/add-edit-clientes/add-edit-clientes.component';
import { ListClientesComponent } from './components/CLIENTES/list-clientes/list-clientes.component';
import { NavbarClienteComponent } from './components/navbar-cliente/navbar-cliente.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListProductsComponent,
    AddEditProductComponent,
    ProgressBarComponent,
    ListHamburguesasComponent,
    AddEditHamburguesaComponent,
    LoginPComponent,
    ClientePrincipalComponent,
    SelectUserComponent,
    MainMenuAdminComponent,
    AddEditClientesComponent,
    ListClientesComponent,
    NavbarClienteComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      positionClass: 'toast-bottom-right',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }