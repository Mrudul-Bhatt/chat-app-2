import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  username?: string;
  email?: string;
  password?: string;

  submitForm(): void {
    console.log('Username:', this.username);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    this.authService.login(this.username, this.password).subscribe(
      (res: any) => {
        console.log(res);
        localStorage.setItem('user', res.value);
        this.router.navigate(['/chat']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
