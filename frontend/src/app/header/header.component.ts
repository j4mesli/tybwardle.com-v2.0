import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { User } from '../models/User.model';
import { Subscription } from 'rxjs';
import { ResizeService } from '../shared/resize.service';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.css'],
  template: `
    <div class="header" *ngIf="windowSize >= 750">
      <div class="header-image">
        <img src="assets/images/bleach.png" routerLink="/">
      </div>
      <div class="header-links">
        <h3 routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" routerLink="/">Home</h3>
        <h3 routerLinkActive="active" routerLink="/about">About</h3>
        <h3 routerLinkActive="active" routerLink="/play">Play</h3>
        <!-- <h3 routerLinkActive="active" routerLink="/stats">Stats</h3> -->
      </div>
      <div class="login-icons">
        <span routerLinkActive="active" class="material-symbols-outlined" routerLink="/login" *ngIf="!user">account_circle</span>
        <span class="material-symbols-outlined" *ngIf="user" (click)="logout()">logout</span>
      </div>
    </div>
    <div class="header-mobile" *ngIf="windowSize < 750">
      <div class="header-image" *ngIf="!showOverlay">
        <img src="assets/images/bleach.png" routerLink="/">
      </div>
      <div class="login-icons" *ngIf="!showOverlay">
        <span class="material-symbols-outlined" (click)="showOverlay = true" *ngIf="!showOverlay">menu</span>
      </div>
      <div class="menu" *ngIf="showOverlay">
        <div class="closing-button">
          <span class="material-symbols-outlined" style="opacity: 0%;">close</span>
          <span class="material-symbols-outlined" (click)="showOverlay = false">close</span>
        </div>
        <ul>
          <li routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" routerLink="/" (click)="showOverlay = false">Home</li>
          <li routerLinkActive="active" routerLink="/about" (click)="showOverlay = false">About</li>
          <li routerLinkActive="active" routerLink="/play" (click)="showOverlay = false">Play</li>
          <!-- <li routerLinkActive="active" routerLink="/stats" (click)="showOverlay = false">Stats</li> -->
          <li id="last" routerLinkActive="active" routerLink="/login" *ngIf="!user" (click)="showOverlay = false">Login&nbsp;<span class="material-symbols-outlined">account_circle</span></li>
          <li id="last" (click)="logout()" *ngIf="user">Logout&nbsp;<span class="material-symbols-outlined">logout</span></li>
        </ul>
      </div>
    </div>
  `,
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User | undefined;
  userSubscription: Subscription | undefined;
  windowSize = 1920; // default value, changes on component mount
  windowSizeSubscription: Subscription | undefined;
  showOverlay = false;

  logout() {
    this.login.logout();
    this.showOverlay = false;
  }

  ngOnInit() { 
    this.userSubscription = this.login.user.subscribe(
      _user => {
        this.user = _user;
      }
    );
    this.windowSizeSubscription = this.resizeService.onResize.subscribe((size: number) => {
      this.windowSize = size;
      if (this.windowSize >= 750) {
        this.showOverlay = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription!.unsubscribe();
    this.windowSizeSubscription!.unsubscribe();
  }

  constructor(
    private login: LoginService,
    private resizeService: ResizeService,
  ) {  }
}
