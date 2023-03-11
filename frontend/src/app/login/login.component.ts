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
  isLoading = false;
  email = '';
  username = '';
  password = '';
  user: User | undefined;
  userSubscription: Subscription | undefined;
  loginError: { error: string } | undefined;
  loginErrorSubscription: Subscription | undefined;
  registrationError: { error: string } | undefined;
  registrationErrorSubscription: Subscription | undefined;
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(this.username, Validators.required),
    password: new FormControl(this.password, Validators.required)
  });
  registerForm: FormGroup = new FormGroup({
    email: new FormControl(this.email, Validators.required),
    username: new FormControl(this.username, Validators.required),
    password: new FormControl(this.password, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}')])
  });
  isLogin = true;

  ngOnInit() {
    this.userSubscription = this.login.user.subscribe(
      _user => {
        this.user = _user;
      }
    );
    this.loginErrorSubscription = this.login.loginError.subscribe(
      _error => {
        this.loginError = _error;
        this.isLoading = false;
      }
    );
    this.registrationErrorSubscription = this.login.registrationError.subscribe(
      _error => {
        this.registrationError = _error;
        this.isLoading = false;
      }
    );
  }

  submitForm(type: 'login' | 'register') {
    this.isLoading = true;
    const form = type === 'login' ? this.loginForm : this.registerForm;
    if (type === 'login') {
      this.login.login(form.value.username, form.value.password).subscribe(
        _user => {
          this.isLoading = false;
        }
      );
    }
    else {
      this.login.register(form.value.email, form.value.username, form.value.password).subscribe(
        _user => {
          this.isLoading = false;
        }
      );
    }
  }

  constructor(
    private login: LoginService,
  ) {  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.loginErrorSubscription?.unsubscribe();
    this.registrationErrorSubscription?.unsubscribe();
  }
}
