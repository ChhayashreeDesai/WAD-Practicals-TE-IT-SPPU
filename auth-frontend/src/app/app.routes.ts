import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { Profile } from './profile/profile'; // Import your new component

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'profile', component: Profile }, // This line fixes the 'profile' error
  { path: '', redirectTo: 'register', pathMatch: 'full' }
];