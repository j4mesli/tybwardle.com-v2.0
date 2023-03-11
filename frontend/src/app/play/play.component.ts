import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ResizeService } from '../shared/resize.service';
import { Subscription } from 'rxjs';
import { PlayService } from './play.service';
import { Characters } from '../models/Characters.model';
import { Character } from '../models/Character.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy {  
  isLoading = false;
  windowWidth: number = 1920;
  windowWidthSubscription: Subscription | undefined;
  canPlay = false;
  canPlaySubscription: Subscription | undefined;
  allCharacters: Characters = [];
  allCharactersSubscription: Subscription | undefined;
  guessObject: Character | undefined;
  guessObjectSubscription: Subscription | undefined;
  guessString: string = '';
  guesses: { character: Character, proximity: any }[] = [];
  guessCounter = 0;
  guessSubscription: Subscription | undefined;
  answer: Character | undefined;
  answerSubscription: Subscription | undefined;
  
  showMatches = false;
  documentListener: any;
  matches: Characters = [];
  guessForm: FormGroup = new FormGroup({
    guessString: new FormControl(this.guessString, Validators.required),
  });
  resultString: string = '';
  resultStringSubscription: Subscription | undefined;

  submitForm() {
    if (this.matches.length > 0) {
      this.isLoading = true;
      this.play.sendGuess(this.matches[0].name).subscribe(
        _guess => {
          console.log(this.guesses)
          this.guessForm.get('guessString')?.setValue('');
          this.isLoading = false;
        }
      );
    }
  }

  copyString() {
    const result = [...this.resultString];
    const res = result.reduce((accumulator, current, index) => {
      if (index % 6 === 0) {
        accumulator.push('');
      }
      accumulator[accumulator.length - 1] += current;
      return accumulator;
    }, [] as any);
    navigator.clipboard.writeText(res.join('\n'));
    alert('Copied result string to clipboard!');
  }

  ngOnInit(): void {
    // this.userSubscription = this.login.user.subscribe(user => this.user = user);
    this.windowWidthSubscription = this.resize.onResize.subscribe(windowWidth => this.windowWidth = windowWidth);
    this.resultStringSubscription = this.play.result.subscribe(resultString => this.resultString = resultString);
    this.guessSubscription = this.play.guesses.subscribe(guesses => {
      this.guesses = guesses;
      this.guessCounter = guesses.length;
    });
    this.guessObjectSubscription = this.play.guessObj.subscribe(guessObj => this.guessObject = guessObj);
    this.answerSubscription = this.play.answer.subscribe(answer => {
      this.answer = answer;
    });
    this.canPlaySubscription = this.play.canSend.subscribe(canPlay => {
      this.canPlay = canPlay;
      if (!canPlay) {
        this.play.getTodayAnswer().subscribe(
          _answer => {
            console.log(_answer)
          }
        );
      }
    });
    this.allCharactersSubscription = this.play.characters.subscribe(characters => this.allCharacters = characters);
    this.guessForm.get('guessString')?.valueChanges.subscribe((value: string) => {
      this.matches = this.allCharacters.filter(character => {
        const regex = new RegExp(`${value}`, "gi");
        return character.name.match(regex);
      }).filter(character => {
        const prevGuesses = this.guesses.map(guess => guess.character.name);
        return !(prevGuesses.includes(character.name));
      });
    });
    this.documentListener = document.addEventListener('click', (event: any) => {
      if (event.target.id !== 'guessString') {
        this.showMatches = false;
      }
      else {
        this.showMatches = true;
      }
    });
  }

  ngOnDestroy(): void {
    // this.userSubscription?.unsubscribe();
    this.windowWidthSubscription?.unsubscribe();
    this.guessSubscription?.unsubscribe();
    this.guessObjectSubscription?.unsubscribe();
    this.canPlaySubscription?.unsubscribe();
    this.allCharactersSubscription?.unsubscribe();
    this.resultStringSubscription?.unsubscribe();
    document.removeEventListener('click', this.documentListener);
  }

  constructor(
    private resize: ResizeService,
    private play: PlayService
  ) {  
    // get json of all characters
    this.play.getCharacters().subscribe(
      _characters => {
        console.log(_characters.characters);
      }
    );

    // validate guesses with cache and backend
    if (localStorage.getItem('canSend')) {
      const canSend = JSON.parse(localStorage.getItem('canSend')!);
      const objDate = new Date(canSend.date).getTime();
      const currDate = new Date(new Date().toLocaleDateString("EN",{ timeZone: "EST" })).getTime();
      if (objDate < currDate) {
        const newSend = { ...canSend, date: new Date().toLocaleDateString("EN",{ timeZone: "EST" }) };
        localStorage.setItem('canSend', JSON.stringify(newSend));
        this.play.canSend.next(true);
      }
      else if (objDate === currDate) {
        if (canSend.canSend) {
          this.play.canSend.next(true);
        }
        else {
          this.play.canSend.next(false);
        }
      }
      else {
        this.play.validateToday().subscribe(
          _response => {
            console.log(_response);
          }
        );
      }
    }
    else {
      this.play.validateToday().subscribe(
        _response => {
          console.log(_response);
        }
      );
    }
  }
}
