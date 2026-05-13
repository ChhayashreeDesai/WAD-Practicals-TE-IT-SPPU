import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class Auth {
  // Update this to match your server.js paths
  private apiUrl = 'http://localhost:3000/api/users'; 

  constructor(private http: HttpClient) {}

  register(user: any) {
    // This will now call http://localhost:3000/api/users/register
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any) {
    // This matches your app.post('/api/users/login', ...)
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  
  getUser(id: string) {
    // This matches your app.get('/api/users/:id', ...)
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // [UPDATE] - Talk to app.put('/api/users/:id')
  updateUser(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // [DELETE] - Talk to app.delete('/api/users/:id')
  deleteUser(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}