import { Component } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.css'],
  template: `
    <div class="header">
      <div class="header-image">
        <img src="assets/images/bleach.png" routerLink="/">
      </div>
      <div class="header-links">
        <h3 routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" routerLink="/">Home</h3>
        <h3 routerLinkActive="active" routerLink="/play">Play</h3>
        <h3 routerLinkActive="active" routerLink="/stats">Stats</h3>
      </div>
      <div class="login-icons">
        <span class="material-symbols-outlined" routerLink="/login" *ngIf="!user">login</span>
        <span class="material-symbols-outlined" *ngIf="user">logout</span>
      </div>
    </div>
  `,
})
export class HeaderComponent {
  user = this.login.user;
  ngOnInit() { console.log(this.user) }

  constructor(
    private login: LoginService
  ) {  }
}
