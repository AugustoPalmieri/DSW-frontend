import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPedidoComponent } from './add-edit-pedido.component';

describe('AddEditPedidoComponent', () => {
  let component: AddEditPedidoComponent;
  let fixture: ComponentFixture<AddEditPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
