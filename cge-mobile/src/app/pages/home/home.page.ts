import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  imports: [IonicModule, CommonModule, RouterLink],
})
export class HomePage implements OnInit {
  nombreCliente: string | null = null;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.nombreCliente = await this.authService.getNombreCliente();
  }

  async logout() {
    await this.authService.logout();
    // al borrar sesión, el guard o el flujo te llevará a login en el futuro;
    // por ahora basta con recargar:
    location.href = '/';
  }
}
