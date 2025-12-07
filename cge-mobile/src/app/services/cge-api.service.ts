import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Medidor, Lectura, Boleta } from '../models/cge.models';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CgeApiService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getMedidoresByCliente(idCliente: number): Observable<Medidor[]> {
    return this.http.get<Medidor[]>(
      `${this.apiUrl}/api/medidores/por-cliente/${idCliente}`
    );
  }

  getLecturasByMedidor(idMedidor: number): Observable<Lectura[]> {
    return this.http.get<Lectura[]>(
      `${this.apiUrl}/api/lecturas/por-medidor/${idMedidor}`
    );
  }

  getBoletasByCliente(idCliente: number): Observable<Boleta[]> {
    // OJO: /api/boleta (singular)
    return this.http.get<Boleta[]>(
      `${this.apiUrl}/api/boleta?id_cliente=${idCliente}`
    );
  }

  getBoletaActualCliente(idCliente: number): Observable<Boleta | null> {
    return this.getBoletasByCliente(idCliente).pipe(
      map((boletas) => boletas[0] ?? null)
    );
  }

  // ⬇️ NUEVO: descargar PDF de boleta
  downloadBoletaPdf(idBoleta: number): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/api/boleta/${idBoleta}/pdf`,
      { responseType: 'blob' }
    );
  }
}
