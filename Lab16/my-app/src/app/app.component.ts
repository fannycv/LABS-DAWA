import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    // Verificar el estado de autenticación al cargar la aplicación
    this.isAuthenticated = this.auth.isAuthenticated();
  }
  // Al iniciar sesión
  login() {
    // Guardar estado de autenticación en el almacenamiento local
    localStorage.setItem('isAuthenticated', 'true');
  }
  // Obtener el estado de autenticación del almacenamiento local

  logout() {
    // Elimina el token del almacenamiento local
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    console.log('Token ' + localStorage.getItem('token'));
  }
}
