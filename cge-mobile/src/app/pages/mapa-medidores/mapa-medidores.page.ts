import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController } from '@ionic/angular';
import * as L from 'leaflet';
import { CgeApiService } from '../../services/cge-api.service';
import { AuthService } from '../../services/auth.service';
import { Medidor } from '../../models/cge.models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mapa-medidores',
  standalone: true,
  templateUrl: './mapa-medidores.page.html',
  imports: [IonicModule, CommonModule],
})
export class MapaMedidoresPage implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map?: L.Map;
  medidores: Medidor[] = [];

  constructor(
    private api: CgeApiService,
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute
  ) {}

  async ngAfterViewInit() {
    const idCliente = await this.auth.getClienteId();
    if (!idCliente) return;

    const loading = await this.loadingCtrl.create({
      message: 'Cargando mapa...',
    });
    await loading.present();

    this.api.getMedidoresByCliente(idCliente).subscribe({
      next: async (data) => {
        this.medidores = data;
        await loading.dismiss();
        this.initMap();
      },
      error: async () => {
        await loading.dismiss();
      },
    });
  }

  private initMap() {
    if (!this.mapContainer) return;

    // Coordenadas por defecto (ej: Constitución/Talca aprox.)
    let centerLat = -35.426;
    let centerLng = -71.655;

    // Si hay medidores con lat/lng, usamos el primero
    const conCoords = this.medidores.filter(
      (m) => m.latitud != null && m.longitud != null
    );

    if (conCoords.length > 0) {
      centerLat = conCoords[0].latitud as number;
      centerLng = conCoords[0].longitud as number;
    }

    this.map = L.map(this.mapContainer.nativeElement).setView(
      [centerLat, centerLng],
      14 // zoom más lejano para ver la ciudad
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    conCoords.forEach((m) => {
      const marker = L.marker([m.latitud as number, m.longitud as number]).addTo(
        this.map as L.Map
      );
      marker.bindPopup(
        `<b>${m.codigo_medidor}</b><br>${m.direccion_suministro}<br>Estado: ${
          m.estado ? 'Activo' : 'Inactivo'
        }`
      );
    });
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
