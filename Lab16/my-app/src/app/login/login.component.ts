import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginData = {
    username: '',
    password: '',
  };

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.auth.login(this.loginData).subscribe(
      (response: any) => {
        // Almacenar el token JWT en el local storage o en una cookie
        localStorage.setItem('token', response.token);

        // Redirigir a la página de inicio o a otra página deseada
        this.router.navigate(['/']);
        console.log(localStorage.getItem('token'));
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
