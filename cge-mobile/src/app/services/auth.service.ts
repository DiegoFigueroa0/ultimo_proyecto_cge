import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/cge.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, data);
  }

  async saveSession(session: LoginResponse) {
    await Preferences.set({
      key: 'auth',
      value: JSON.stringify(session),
    });
  }

  async getSession(): Promise<LoginResponse | null> {
    const { value } = await Preferences.get({ key: 'auth' });
    if (!value) return null;
    return JSON.parse(value);
  }

  async getClienteId(): Promise<number | null> {
    const session = await this.getSession();
    return session?.id_cliente ?? null;
  }

  async getNombreCliente(): Promise<string | null> {
    const session = await this.getSession();
    return session?.nombre_cliente ?? null;
  }

  async logout() {
    await Preferences.remove({ key: 'auth' });
  }
}
