import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User.model';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';

export interface AuthResponse {
  error: string,
  message: string,
  code: number,
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  user = new BehaviorSubject<User | undefined>(undefined);

  // methods
  getUser() {
    return this.user.value;
  }

  login(username: string, password: string) {
    return this.http.get<AuthResponse>(
      "http://localhost:5000" + '/auth',
      { 
        params: new HttpParams()
          .append("username", username)
          .append("password", password), 
        headers: new HttpHeaders()
          .append("auth", "My name is Yoshikage Kira. I'm 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married. I work as an employee for the Kame Yu department stores, and I get home every day by 8 PM at the latest. I don't smoke, but I occasionally drink. I'm in bed by 11 PM, and make sure I get eight hours of sleep, no matter what. After having a glass of warm milk and doing about twenty minutes of stretches before going to bed, I usually have no problems sleeping until morning. Just like a baby, I wake up without any fatigue or stress in the morning. I was told there were no issues at my last check-up. I'm trying to explain that I'm a person who wishes to live a very quiet life. I take care not to trouble myself with any enemies, like winning and losing, that would cause me to lose sleep at night. That is how I deal with society, and I know that is what brings me happiness. Although, if I were to fight I wouldn't lose to anyone.") 
      }
    )
    .pipe(catchError(this.handleError), tap(resData => { 
      this.user.next(new User(username, password))
    }));
  }

  logout() {
    this.user.next(undefined);
    this.router.navigate(['/login']);
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  private handleError = (errorRes: HttpErrorResponse) => {
    let message = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) return throwError(() => new Error(message));
    switch(errorRes.error.error) {
      case 'INVALID REQUEST PROVIDED':
        message += ' Your request was rejected as unauthorized!';
        break;
      case 'Invalid Login: Invalid Username And/Or Password Provided!':
        message += ' Your username or password was incorrect!';
        break;
      case 'EMAIL_NOT_FOUND':
        message += ' This email does not exist!';
        break;
    }
    return throwError(() => new Error(message));
  }
}
