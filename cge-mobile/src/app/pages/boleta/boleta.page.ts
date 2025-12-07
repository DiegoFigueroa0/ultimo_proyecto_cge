import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { CgeApiService } from '../../services/cge-api.service';
import { Boleta } from '../../models/cge.models';

@Component({
  selector: 'app-boleta',
  standalone: true,
  templateUrl: './boleta.page.html',
  imports: [IonicModule, CommonModule],
})
export class BoletaPage implements OnInit {
  boleta: Boleta | null = null;
  descargando = false;

  constructor(
    private auth: AuthService,
    private api: CgeApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    const idCliente = await this.auth.getClienteId();
    if (!idCliente) return;

    const loading = await this.loadingCtrl.create({
      message: 'Cargando boleta...',
    });
    await loading.present();

    this.api.getBoletaActualCliente(idCliente).subscribe({
      next: async (b) => {
        this.boleta = b;
        await loading.dismiss();
      },
      error: async () => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'No se pudo cargar la boleta.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }

  async descargarPdf() {
    if (!this.boleta) {
      const toast = await this.toastCtrl.create({
        message: 'No hay boleta para descargar.',
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    this.descargando = true;

    this.api.downloadBoletaPdf(this.boleta.id_boleta).subscribe({
      next: async (blob) => {
        this.descargando = false;

        const url = URL.createObjectURL(blob);
        // En navegador: abrir en nueva pestaña
        window.open(url, '_blank');

        // Liberar memoria más tarde
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      },
      error: async () => {
        this.descargando = false;
        const toast = await this.toastCtrl.create({
          message: 'Error al descargar PDF.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }
}
