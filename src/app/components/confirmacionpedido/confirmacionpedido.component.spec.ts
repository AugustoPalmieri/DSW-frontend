import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionPedidoComponent } from './confirmacionpedido.component';

describe('ConfirmacionpedidoComponent', () => {
  let component: ConfirmacionPedidoComponent;
  let fixture: ComponentFixture<ConfirmacionPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmacionPedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
