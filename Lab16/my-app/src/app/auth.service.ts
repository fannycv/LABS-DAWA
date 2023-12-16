import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );

  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userData);
  }

  isAuthenticated(): boolean {
    // Verifica si el token está presente en el almacenamiento local
    return !!localStorage.getItem('token');
  }

  setAuthenticated(value: boolean): void {
    // Método para actualizar el estado de autenticación y notificar a los suscriptores
    this.isAuthenticatedSubject.next(value);
  }
}
