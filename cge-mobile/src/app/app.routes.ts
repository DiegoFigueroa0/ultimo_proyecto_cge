import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.routes').then((m) => m.routes),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.routes').then((m) => m.routes),
  },
  {
    path: 'medidores',
    loadChildren: () =>
      import('./pages/medidores/medidores.routes').then((m) => m.routes),
  },
  {
    path: 'lecturas/:idMedidor',
    loadChildren: () =>
      import('./pages/lecturas/lecturas.routes').then((m) => m.routes),
  },
  {
    path: 'boleta',
    loadChildren: () =>
      import('./pages/boleta/boleta.routes').then((m) => m.routes),
  },
  {
    path: 'mapa-medidores',
    loadChildren: () =>
      import('./pages/mapa-medidores/mapa-medidores.routes').then(
        (m) => m.routes
      ),
  },
];
