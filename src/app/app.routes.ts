import { Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    loadChildren: () => import('./base/base.module').then(m => m.BaseModule)
  }
];
