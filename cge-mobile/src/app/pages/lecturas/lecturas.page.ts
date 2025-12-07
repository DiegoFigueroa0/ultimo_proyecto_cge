import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CgeApiService } from '../../services/cge-api.service';
import { Lectura } from '../../models/cge.models';

@Component({
  selector: 'app-lecturas',
  standalone: true,
  templateUrl: './lecturas.page.html',
  imports: [IonicModule, CommonModule],
})
export class LecturasPage implements OnInit {
  idMedidor!: number;
  lecturas: Lectura[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: CgeApiService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    this.idMedidor = Number(this.route.snapshot.paramMap.get('idMedidor'));

    const loading = await this.loadingCtrl.create({
      message: 'Cargando lecturas...',
    });
    await loading.present();

    this.api.getLecturasByMedidor(this.idMedidor).subscribe({
      next: async (data) => {
        this.lecturas = data;
        await loading.dismiss();
      },
      error: async () => {
        await loading.dismiss();
      },
    });
  }
}
