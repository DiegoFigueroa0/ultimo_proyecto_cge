import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController } from '@ionic/angular';
import * as L from 'leaflet';
import { AuthService } from '../../services/auth.service';
import { CgeApiService } from '../../services/cge-api.service';
import { Medidor } from '../../models/cge.models';

@Component({
  selector: 'app-mapa-medidores',
  standalone: true,
  templateUrl: './mapa-medidores.page.html',
  imports: [IonicModule, CommonModule],
})
export class MapaMedidoresPage implements OnInit, OnDestroy {
  private map: L.Map | null = null;
  medidores: Medidor[] = [];

  constructor(
    private auth: AuthService,
    private api: CgeApiService,
    private loadingCtrl: LoadingController,
  ) {}

  async ngOnInit() {
    const idCliente = await this.auth.getClienteId();
    if (!idCliente) return;

    const loading = await this.loadingCtrl.create({
      message: 'Cargando mapa...',
    });
    await loading.present();

    this.api.getMedidoresByCliente(idCliente).subscribe({
      next: async (meds) => {
        this.medidores = meds.filter(
          (m) => m.latitud != null && m.longitud != null
        );
        await loading.dismiss();
        this.initMap();
      },
      error: async () => {
        await loading.dismiss();
      },
    });
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap() {
    if (this.map) {
      this.map.remove();
    }

    // centro por defecto (si no hay coords)
    const defaultCenter: L.LatLngExpression = [-35.334, -72.416]; // por ejemplo Constitución

    const first = this.medidores[0];
    const center: L.LatLngExpression =
      first && first.latitud != null && first.longitud != null
        ? [Number(first.latitud), Number(first.longitud)]
        : defaultCenter;

    this.map = L.map('mapa-medidores-container', {
      center,
      zoom: 14,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
      maxZoom: 19,
    }).addTo(this.map);

    this.medidores.forEach((m) => {
      if (m.latitud != null && m.longitud != null) {
        L.marker([Number(m.latitud), Number(m.longitud)])
          .addTo(this.map!)
          .bindPopup(`<b>${m.codigo_medidor}</b><br>${m.direccion_suministro}`);
      }
    });

    // si hay varios, ajustar zoom a todos
    if (this.medidores.length > 1) {
      const bounds = L.latLngBounds(
        this.medidores
          .filter((m) => m.latitud != null && m.longitud != null)
          .map((m) => [Number(m.latitud), Number(m.longitud)] as [number, number])
      );
      this.map.fitBounds(bounds, { padding: [40, 40] });
    }
  }
}
