import { Routes } from '@angular/router';
import { HomeComponent } from './service/pages/home/home.component';
import {authenticationGuard} from "./iam/services/authentication.guard";

export const routes: Routes = [
  {
    path: '',
    title: 'home',
    component: HomeComponent,
    canActivate: [authenticationGuard]
  },
  {
    path: 'login',
    title: 'login',
    loadComponent: () => import('./iam/pages/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  {
    path: 'register',
    title: 'register',
    loadComponent: () => import('./iam/pages/sign-up/sign-up.component').then(m => m.SignUpComponent)
  },
  {
    path : '**',
    title: 'not-found',
    loadComponent: () => import('./public/pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
