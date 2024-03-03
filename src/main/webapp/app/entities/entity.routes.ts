import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'client',
    data: { pageTitle: 'ermConsoleApp.client.home.title' },
    loadChildren: () => import('./client/client.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
