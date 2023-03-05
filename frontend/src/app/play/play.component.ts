import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  ngOnInit(): void {
      console.log(this.login.user)
  }

  constructor(
    private login: LoginService,
  ) {  }
}
