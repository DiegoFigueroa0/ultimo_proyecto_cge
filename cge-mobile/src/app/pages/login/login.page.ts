import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonicModule,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class LoginPage {
  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.form = fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    this.authService.login(this.form.value).subscribe({
      next: async (resp) => {
        await this.authService.saveSession(resp);
        await loading.dismiss();
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      error: async (err) => {
        await loading.dismiss();
        const msg = err?.error?.detail || 'Error al iniciar sesión';
        const toast = await this.toastCtrl.create({
          message: msg,
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }
}
