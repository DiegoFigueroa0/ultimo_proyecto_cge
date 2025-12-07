import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonicModule,
  LoadingController,
} from '@ionic/angular';
import { CgeApiService } from '../../services/cge-api.service';
import { AuthService } from '../../services/auth.service';
import { Medidor } from '../../models/cge.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medidores',
  standalone: true,
  templateUrl: './medidores.page.html',
  imports: [IonicModule, CommonModule],
})
export class MedidoresPage implements OnInit {
  medidores: Medidor[] = [];

  constructor(
    private api: CgeApiService,
    private auth: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    const idCliente = await this.auth.getClienteId();
    if (!idCliente) return;

    const loading = await this.loadingCtrl.create({
      message: 'Cargando medidores...',
    });
    await loading.present();

    this.api.getMedidoresByCliente(idCliente).subscribe({
      next: async (data) => {
        this.medidores = data;
        await loading.dismiss();
      },
      error: async () => {
        await loading.dismiss();
      },
    });
  }

  verLecturas(m: Medidor) {
    this.router.navigate(['/lecturas', m.id_medidor]);
  }

  verEnMapa(m: Medidor) {
    this.router.navigate(['/mapa-medidores'], {
      queryParams: { idMedidor: m.id_medidor },
    });
  }
}
