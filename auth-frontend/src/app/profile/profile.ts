import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Added ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width: 400px; margin: 50px auto; border: 2px solid #000; padding: 20px; font-family: sans-serif;">
      <h1>User Profile</h1>
      <hr>

      <div *ngIf="user">
        <label><strong>Name:</strong></label>
        <input [(ngModel)]="user.name" style="width: 100%; margin-bottom: 10px; padding: 8px;">
        
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Database ID:</strong> {{ user._id }}</p>

        <button (click)="onUpdate()" style="width: 100%; background: #007bff; color: white; margin-bottom: 10px; padding: 10px; border: none; cursor: pointer;">
          Update Name (CRUD - U)
        </button>

        <button (click)="onDelete()" style="width: 100%; background: #dc3545; color: white; padding: 10px; border: none; cursor: pointer;">
          Delete Account (CRUD - D)
        </button>
      </div>

      <div *ngIf="!user">
        <p style="color: orange;">Connecting to Node.js API...</p>
        <p style="font-size: 12px;">Waiting for data from MongoDB...</p>
      </div>
    </div>
  `
})
export class Profile implements OnInit {
  user: any = null;

  constructor(
    private auth: Auth, 
    private cdr: ChangeDetectorRef // 2. Inject the detector
  ) {}

  ngOnInit() {
    const id = localStorage.getItem('userId');
    if (id) {
      this.auth.getUser(id).subscribe({
        next: (res: any) => { 
          console.log("Setting user data...", res);
          this.user = res; 
          this.cdr.detectChanges(); // 3. FORCE THE SCREEN TO UPDATE
        },
        error: (err) => console.error("Fetch failed", err)
      });
    }
  }

  // --- CRUD: UPDATE ---
  onUpdate() {
    // Calls app.put('/api/users/:id') in your server.js
    this.auth.updateUser(this.user._id, this.user).subscribe({
      next: (res: any) => alert("Updated: " + res.message),
      error: (err) => alert("Update failed")
    });
  }

  // --- CRUD: DELETE ---
  onDelete() {
    // Calls app.delete('/api/users/:id') in your server.js
    if (confirm("Permanently delete this user from MongoDB?")) {
      this.auth.deleteUser(this.user._id).subscribe({
        next: (res: any) => {
          alert(res.message);
          localStorage.clear();
          window.location.href = '/register';
        },
        error: (err) => alert("Delete failed")
      });
    }
  }
}