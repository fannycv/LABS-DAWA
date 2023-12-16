import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      // El token existe, el usuario está autenticado
      return true;
    } else {
      // El token no existe, el usuario no está autenticado
      this.router.navigate(['/login']);
      return false;
    }
  }
}
