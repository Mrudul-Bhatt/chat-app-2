import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(username?: string, email?: string, password?: string) {
    const body = { username, email, password };
    return this.http.post('https://localhost:7158/api/Auth/Signup', body);
  }

  login(username?: string, password?: string) {
    const body = { username, password };
    return this.http.post('https://localhost:7158/api/Auth/Login', body);
  }
}
