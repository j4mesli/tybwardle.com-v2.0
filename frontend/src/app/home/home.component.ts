import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { User } from '../models/User.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  template: `
    <div class="home">
      <div class="heading">
        <h1>THOUSAND YEAR BLOOD WAR-DLE</h1>
        <h5>Experience the <span [style]="{ color: '#e73a00' }">Blood Warfare...</span> in words!</h5>
      </div>
      <div class="login-prompt">
        <h5 *ngIf="!user">Want to play? <span routerLink="/login">Create an account here!</span></h5>
        <h5 *ngIf="user">Welcome back! <span routerLink="/play">Let's go play!</span></h5>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  user: User | undefined;
  userSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.userSubscription = this.login.user.subscribe(user => {
      this.user = user;
    });
  }
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
  constructor(
    private login: LoginService,
  ) {}
}
