import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ADD THIS
import { Auth } from '../auth'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule], // ADD THIS
  templateUrl: './register.html',
})
export class Register {
  user = { name: '', email: '', password: '' };

  constructor(private auth: Auth, private router: Router) {}

  onReg() {
  this.auth.register(this.user).subscribe({
    next: (res: any) => {
      alert(res.message); // Will show "User Registered Successfully!"
      this.router.navigate(['/login']);
    },
    error: (err: any) => {
      console.error(err);
      alert("Registration failed. Check the console for details.");
    }
  });
}
}
