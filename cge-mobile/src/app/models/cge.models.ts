export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  id_usuario: number;
  id_cliente: number;
  correo: string;
  nombre_cliente: string;
  token: string;
}

export interface Medidor {
  id_medidor: number;
  codigo_medidor: string;
  id_cliente: number;
  direccion_suministro: string;
  latitud?: number | null;
  longitud?: number | null;
  estado: boolean; // en la API es bool
}

export interface Lectura {
  id_lectura: number;
  id_medidor: number;
  anio: number;
  mes: number;
  lectura_kwh: number;
  observacion?: string | null;
  created_at?: string | null;
}

export interface Boleta {
  id_boleta: number;
  id_cliente: number;
  anio: number;
  mes: number;
  kwh_total: number;
  tarifa_base: number;
  cargos: number;
  iva: number;
  total_pagar: number;
  estado: string;
}
