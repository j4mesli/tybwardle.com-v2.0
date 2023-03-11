import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User.model';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { CookieHeaders } from '../models/CookieHeaders.model';

export interface AuthResponse {
  error: string;
  message: string;
  code: number;
  auth: CookieHeaders;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  user = new BehaviorSubject<User | undefined>(undefined);
  loginError = new BehaviorSubject<{ error: string } | undefined>(undefined);
  registrationError = new BehaviorSubject<{ error: string } | undefined>(undefined);

  // methods
  getUser() {
    return this.user.value;
  }

  register(email: string, username: string, password: string) {
    return this.http.get<AuthResponse>(
      "https://tybwardle-backend.herokuapp.com" + '/register',
      { 
        params: new HttpParams()
          .append("email", email)
          .append("username", username)
          .append("password", password), 
        headers: new HttpHeaders()
          .append("auth", "My name is Yoshikage Kira. I'm 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married. I work as an employee for the Kame Yu department stores, and I get home every day by 8 PM at the latest. I don't smoke, but I occasionally drink. I'm in bed by 11 PM, and make sure I get eight hours of sleep, no matter what. After having a glass of warm milk and doing about twenty minutes of stretches before going to bed, I usually have no problems sleeping until morning. Just like a baby, I wake up without any fatigue or stress in the morning. I was told there were no issues at my last check-up. I'm trying to explain that I'm a person who wishes to live a very quiet life. I take care not to trouble myself with any enemies, like winning and losing, that would cause me to lose sleep at night. That is how I deal with society, and I know that is what brings me happiness. Although, if I were to fight I wouldn't lose to anyone.") 
      }
    ).pipe(
      catchError(this.handleRegistrationError),
      tap(
        resData => {
          this.registrationError.next(undefined);
          this.user.next(new User(resData.auth.user, resData.auth.auth));
          localStorage.setItem('user', JSON.stringify(this.user.value));
          this.router.navigate(['/']);
        }
      )
    );
  }

  login(username: string, password: string) {
    return this.http.get<AuthResponse>(
      "https://tybwardle-backend.herokuapp.com" + '/auth',
      { 
        params: new HttpParams()
          .append("username", username)
          .append("password", password), 
        headers: new HttpHeaders()
          .append("auth", "My name is Yoshikage Kira. I'm 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married. I work as an employee for the Kame Yu department stores, and I get home every day by 8 PM at the latest. I don't smoke, but I occasionally drink. I'm in bed by 11 PM, and make sure I get eight hours of sleep, no matter what. After having a glass of warm milk and doing about twenty minutes of stretches before going to bed, I usually have no problems sleeping until morning. Just like a baby, I wake up without any fatigue or stress in the morning. I was told there were no issues at my last check-up. I'm trying to explain that I'm a person who wishes to live a very quiet life. I take care not to trouble myself with any enemies, like winning and losing, that would cause me to lose sleep at night. That is how I deal with society, and I know that is what brings me happiness. Although, if I were to fight I wouldn't lose to anyone.") 
      }
    )
    .pipe(catchError(this.handleLoginError), tap(resData => { 
      this.loginError.next(undefined);
      this.user.next(new User(resData.auth.user, resData.auth.auth));
      localStorage.setItem('user', JSON.stringify(this.user.value));
      this.router.navigate(['/']);
    }));
  }

  logout() {
    localStorage.clear();
    this.user.next(undefined);
    this.router.navigate(['/login']);
  }

  autoLogin() {
    if (localStorage.getItem('user')) {
      const user: User = JSON.parse(localStorage.getItem('user')!);
      this.user.next(user);
    }
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  private handleLoginError = (errorRes: HttpErrorResponse) => {
    let message = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      this.loginError.next({ error: "An unknown error occurred!" });
      return throwError(() => new Error(message));
    } 
    switch(errorRes.error.error) {
      case 'INVALID REQUEST PROVIDED':
        message += ' Your request was rejected as unauthorized!';
        break;
      case 'Invalid Login: Invalid Username And/Or Password Provided!':
        message += ' Your username or password was incorrect!';
        break;
    }
    this.loginError.next({ error: errorRes.error.error });
    return throwError(() => new Error(message));
  }
  private handleRegistrationError = (errorRes: HttpErrorResponse) => {
    let message = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      this.loginError.next({ error: "An unknown error occurred!" });
      return throwError(() => new Error(message));
    }
    switch(errorRes.error.error) {
      case 'INVALID REQUEST PROVIDED':
        message += ' Your request was rejected as unauthorized!';
        break;
      case 'Invalid Login: Invalid Username And/Or Password Provided!':
        message += ' Your username or password was incorrect!';
        break;
    }
    this.registrationError.next({ error: errorRes.error.error });
    return throwError(() => new Error(message));
  }
}
