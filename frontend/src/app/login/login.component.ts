import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './login.service';
import { User } from '../models/User.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  username = '';
  password = '';
  user: User | undefined;
  userSubscription: Subscription | undefined;
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(this.username, Validators.required),
    password: new FormControl(this.password, Validators.required)
  });
  registerForm: FormGroup = new FormGroup({
    email: new FormControl(this.email, Validators.required),
    username: new FormControl(this.username, Validators.required),
    password: new FormControl(this.password, Validators.required)
  });
  isLogin = true;

  ngOnInit() {
    this.login.login('admin', 'password').subscribe(
      _user => {
        this.user = new User('admin', 'password');
        console.log(this.user)
      }
    )
    this.userSubscription = this.login.user.subscribe(
      _user => {
        this.user = _user;
      }
    );
  }

  submitForm(type: 'login' | 'register') {

  }

  constructor(
    private login: LoginService
  ) {  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
