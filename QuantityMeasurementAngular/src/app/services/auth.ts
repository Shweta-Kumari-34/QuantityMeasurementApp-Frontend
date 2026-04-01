import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authBaseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  register(data: AuthRequest): Observable<string> {
    return this.http.post(this.authBaseUrl + '/register', data, {
      responseType: 'text',
    });
  }

  login(data: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authBaseUrl + '/login', data).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('isLoggedIn', 'true');
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('isLoggedIn');
  }
}
