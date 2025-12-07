import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaMedidoresPage } from './mapa-medidores.page';

describe('MapaMedidoresPage', () => {
  let component: MapaMedidoresPage;
  let fixture: ComponentFixture<MapaMedidoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaMedidoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
