import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../auth';
import { Router, RouterLink } from '@angular/router'; // Added RouterLink

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink], // Added RouterLink
  template: `
    <div class="neo-card">
      <h2>Login</h2>
      <input [(ngModel)]="credentials.email" name="email" placeholder="Email">
      <input [(ngModel)]="credentials.password" name="password" type="password" placeholder="Password">
      <button (click)="onLogin()">Access Account</button>
      
      <p class="link-text">
        New here? <a routerLink="/register">Create an account</a>
      </p>
    </div>
  `
})
export class Login {
  credentials = { email: '', password: '' };

  constructor(private auth: Auth, private router: Router) {}

  onLogin() {
    this.auth.login(this.credentials).subscribe({
      next: (res: any) => {
        alert("Login Successful!");
        localStorage.setItem('userId', res.user._id); // cite: server.js
        this.router.navigate(['/profile']);
      },
      error: (err: any) => alert("Invalid Credentials")
    });
  }
}