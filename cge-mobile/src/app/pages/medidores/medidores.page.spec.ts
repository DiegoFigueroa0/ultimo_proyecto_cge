import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedidoresPage } from './medidores.page';

describe('MedidoresPage', () => {
  let component: MedidoresPage;
  let fixture: ComponentFixture<MedidoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MedidoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
