import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="about">
      <h1>ABOUT</h1>
      <div class="header">
        <strong>
          <em>A BLEACH Wordle Game</em>
          <br>
          <br>
          Updates Daily
        </strong>
      </div>
      <div class="text">
        <p><em>THOUSAND YEAR BLOOD WARDLE</em> is a game based off the New York Times' Wordle minigame where you take turns guessing what a hidden word is!</p>
        <p>To play, you enter a guess into the text bar, and submit it! The game will then tell you whether your answer is <span style="color: #32cd32">CORRECT</span> or <span style="color: #cc3300">INCORRECT</span>, and if incorrect, will highlight the mismatching information provided <span style="color: #cc3300">RED</span>.</p>
        <p>The game will also indicate to you when your guess' measurements are wrong! A "🔺" next to a guess' value means the answer's value is greater than the guess', a "🔻" indicates that the answer's is less, and a "❌" means the value type is incorrect! (ex: if the answer doesn't have a provided height, the "❌" will always be displayed, and vice versa!)</p>
        <p>Created by <a href="https://www.linkedin.com/in/j4meslii/" target="_blank">James Li</a> with <strong><span [style]="{ color: '#41adff' }">TypeScript</span>, <span [style]="{ color: '#e73a00' }">Angular</span>, <span [style]="{ color: '#3283CA' }">PostgreSQL</span>,</strong> and <strong><span [style]="{ color: '#ccb7e5' }">Express!</span></strong>. View the repository <a href="https://github.com/j4mesli/tybwardle.com-v2.0" target="_blank">here</a>!</p>
        <p><em>BLEACH</em>, it's characters, and their likenesses are all owned by VIZ Media, Shueisha, and Tite Kubo. Please support the official release!</p>
      </div>
    </div>
  `,
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

}
