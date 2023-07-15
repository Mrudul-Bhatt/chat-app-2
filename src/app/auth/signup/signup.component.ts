import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  username?: string;
  email?: string;
  password?: string;

  submitForm(): void {
    console.log('Username:', this.username);
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    this.authService.signup(this.username, this.email, this.password).subscribe(
      (res) => {
        console.log(res);
        let user;
        // localStorage.setItem('user', res.);
        this.router.navigate(['/chat']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
