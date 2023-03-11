import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Characters } from '../models/Characters.model';
import { Character } from '../models/Character.model';
import { GuessParams } from '../models/GuessParams.model';

export interface TodayValidation {
  error?: string,
  proceed: boolean,
  code: number,
  date: string | number | Date,
}

export interface AllCharacterFetchResponse {
  error: string;
  message: string;
  characters: Characters;
  code: number;
}

export interface GuessResponse {
  error: string;
  message: string;
  guessProximity: GuessParams;
  guess: Character;
  resultString: string;
  count: number;
  code: number;
}

export interface AnswerResponseNest {
  answer: string, 
  date: string, 
  id: number, 
  result: string, 
  resultstring: string, 
  username: string 
}

export interface AnswerResponse {
  data: AnswerResponseNest;
}

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  canSend = new BehaviorSubject<boolean>(localStorage.getItem('user') ? localStorage.getItem('user')==="true" && localStorage.getItem("canSend") ? localStorage.getItem("canSend")==="true" ? true : false : false : false);
  guess = new BehaviorSubject<string | undefined>(undefined);
  guessObj = new BehaviorSubject<Character | undefined>(undefined);
  guesses = new BehaviorSubject<{ character: Character, proximity: any }[]>([]);
  result = new BehaviorSubject<string>(" ");
  characters = new BehaviorSubject<Characters>([]);
  answer = new BehaviorSubject<Character | undefined>(undefined);

  validateToday() {
    const headers = new HttpHeaders()
      .append("user", JSON.stringify(localStorage.getItem('user')!))
      .append("auth", "My name is Yoshikage Kira. I'm 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married. I work as an employee for the Kame Yu department stores, and I get home every day by 8 PM at the latest. I don't smoke, but I occasionally drink. I'm in bed by 11 PM, and make sure I get eight hours of sleep, no matter what. After having a glass of warm milk and doing about twenty minutes of stretches before going to bed, I usually have no problems sleeping until morning. Just like a baby, I wake up without any fatigue or stress in the morning. I was told there were no issues at my last check-up. I'm trying to explain that I'm a person who wishes to live a very quiet life. I take care not to trouble myself with any enemies, like winning and losing, that would cause me to lose sleep at night. That is how I deal with society, and I know that is what brings me happiness. Although, if I were to fight I wouldn't lose to anyone.");
    return this.http.get<TodayValidation>(
      "https://tybwardle-backend.herokuapp.com" + '/validateToday',
      {
        headers: headers
      }
    ).pipe(
      catchError(this.handleTodayValidationError),
      tap(
        resData => {
          localStorage.setItem("canSend", JSON.stringify({ canSend: resData.proceed.toString(), date: resData.date }));
          this.canSend.next(resData.proceed);
        }
      )
    );
  }

  getCharacters() {
    return this.http.get<AllCharacterFetchResponse>(
      "https://tybwardle-backend.herokuapp.com" + '/fetchAllCharacters',
      {
        headers: new HttpHeaders()
          .append("user", JSON.stringify(localStorage.getItem('user')!))
          .append("auth", "My name is Yoshikage Kira. I'm 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married. I work as an employee for the Kame Yu department stores, and I get home every day by 8 PM at the latest. I don't smoke, but I occasionally drink. I'm in bed by 11 PM, and make sure I get eight hours of sleep, no matter what. After having a glass of warm milk and doing about twenty minutes of stretches before going to bed, I usually have no problems sleeping until morning. Just like a baby, I wake up without any fatigue or stress in the morning. I was told there were no issues at my last check-up. I'm trying to explain that I'm a person who wishes to live a very quiet life. I take care not to trouble myself with any enemies, like winning and losing, that would cause me to lose sleep at night. That is how I deal with society, and I know that is what brings me happiness. Although, if I were to fight I wouldn't lose to anyone.") 
      }
    ).pipe(
      catchError(err => throwError(() => err.error.error)),
      tap(
        resData => {
          this.characters.next(resData.characters);
        }
      )
    );
  }

  sendGuess(guess: string) {
    const userObj = JSON.parse(localStorage.getItem('user')!);
    const username = userObj._username;
    return this.http.get<GuessResponse>(
      "https://tybwardle-backend.herokuapp.com" + '/processGuess',
      {
        params: new HttpParams()
          .append("guessCount", this.guesses.value.length)
          .append("guess", guess)
          .append("username", username)
          .append("resultString", this.result.value),
        headers: new HttpHeaders()
          .append("user", JSON.stringify(localStorage.getItem('user')!))
          .append("auth", "My name is Yoshikage Kira. I'm 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married. I work as an employee for the Kame Yu department stores, and I get home every day by 8 PM at the latest. I don't smoke, but I occasionally drink. I'm in bed by 11 PM, and make sure I get eight hours of sleep, no matter what. After having a glass of warm milk and doing about twenty minutes of stretches before going to bed, I usually have no problems sleeping until morning. Just like a baby, I wake up without any fatigue or stress in the morning. I was told there were no issues at my last check-up. I'm trying to explain that I'm a person who wishes to live a very quiet life. I take care not to trouble myself with any enemies, like winning and losing, that would cause me to lose sleep at night. That is how I deal with society, and I know that is what brings me happiness. Although, if I were to fight I wouldn't lose to anyone.") 
      }
    ).pipe(
      catchError(this.handleGuessError),
      tap(
        resData => {
          if (resData.count === 10 || resData.message === "Correct guess, good job!") {
            this.canSend.next(false);
            localStorage.setItem("canSend", JSON.stringify({ canSend: false, date: new Date().toLocaleDateString("EN",{ timeZone: "EST" }) }));
          }
          this.guess.next(guess);
          this.guessObj.next(resData.guess);
          this.guesses.next([...this.guesses.value, { character: resData.guess, proximity: resData.guessProximity }]);
          let temp = (this.result.value === " " || this.result.value === "") ? "" : this.result.value;
          console.log(temp.length, resData.resultString.length);
          temp += resData.resultString;
          this.result.next(resData.resultString);
        }
      )
    );
  }

  getTodayAnswer() {
    return this.http.get<AnswerResponse>(
      "https://tybwardle-backend.herokuapp.com" + '/getTodayGuess',
      {
        headers: new HttpHeaders()
          .append("user", JSON.stringify(localStorage.getItem('user')!))
          .append("auth", "My name is Yoshikage Kira. I'm 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married. I work as an employee for the Kame Yu department stores, and I get home every day by 8 PM at the latest. I don't smoke, but I occasionally drink. I'm in bed by 11 PM, and make sure I get eight hours of sleep, no matter what. After having a glass of warm milk and doing about twenty minutes of stretches before going to bed, I usually have no problems sleeping until morning. Just like a baby, I wake up without any fatigue or stress in the morning. I was told there were no issues at my last check-up. I'm trying to explain that I'm a person who wishes to live a very quiet life. I take care not to trouble myself with any enemies, like winning and losing, that would cause me to lose sleep at night. That is how I deal with society, and I know that is what brings me happiness. Although, if I were to fight I wouldn't lose to anyone.") 
      }
    ).pipe(
      catchError(this.handleTodayAnswerError),
      tap(
        resData => {
          const charObj = this.characters.value.filter(character => character.name === resData.data.answer)[0];
          this.answer.next(charObj);
          this.result.next(resData.data.resultstring);
        }
      )
    );
  }

  private handleTodayAnswerError = (errorRes: HttpErrorResponse) => {
    let message = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => message);
    }
    switch (errorRes.error.error) {
      case "INVALID REQUEST PROVIDED":
        message += ' Your request was rejected as unauthorized!';
        break;
      case "INVALID REQUEST PROVIDED: cookie":
        message += ' Check the cookie!';
        break;
      case "USER DIDN'T COMPLETE IT TODAY":
        message += ' The user didn\'t solve today\'s puzzle!';
        localStorage.setItem("canSend", JSON.stringify({ canSend: true, date: new Date().toLocaleDateString("EN",{ timeZone: "EST" }) }));
        this.canSend.next(true);
        this.result.next(" ");
        this.guess.next('');
        this.guessObj.next(undefined);
        this.guesses.next([]);
        break;
    }
    return throwError(() => message);
  }

  private handleTodayValidationError = (errorRes: HttpErrorResponse) => {
    let message = 'An unknown error occurred!';
    this.canSend.next(false);
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => message);
    }
    switch (errorRes.error.error) {
      case "INVALID REQUEST PROVIDED":
        message += ' Your request was rejected as unauthorized!';
        break;
      case "INVALID REQUEST PROVIDED: cookie":
        message += ' Check the cookie!';
        break;
      case "ALREADY SOLVED TODAY":
        message += ' You have already solved today\'s puzzle!';
        break;
    }
    localStorage.setItem("canSend", JSON.stringify({ canSend: false, date: new Date().toLocaleDateString("EN",{ timeZone: "EST" }) }));
    return throwError(() => message);
  }

  private handleGuessError = (errorRes: HttpErrorResponse) => {
    let message = 'An unknown error occurred!';
    this.canSend.next(false);
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => message);
    }
    switch (errorRes.error.error) {
      case "INVALID REQUEST PROVIDED":
        message += ' Your request was rejected as unauthorized!';
        break;
      case "INVALID REQUEST PROVIDED: cookie":
        message += ' Check the cookie!';
        break;
      case "Invalid guess: CHARACTER/GUESS COUNT/GUESS STRING/USERNAME NOT VALID!":
        message += ' Check your guess!';
        break;
      case "Invalid guess: CHARACTER NOT FOUND IN CHARACTER.JSON!":
        message += ' Guess not found in JSON object!';
        break;
      case "COUNT IS > 10!":
        message += ' You have exceeded the maximum number of guesses!';
        break;
    }
    return throwError(() => message);
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {  }
}
