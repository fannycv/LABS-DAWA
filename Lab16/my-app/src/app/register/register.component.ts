import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerData = {
    username: '',
    password: '',
  };

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  register() {
    this.auth.register(this.registerData).subscribe(
      (success) => console.log('Registration Success'),
      (err) => console.error(err)
    );
  }
}
