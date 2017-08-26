import { Injectable } from '@angular/core';
import { HttpClient } from '../httpClient';
import 'rxjs/add/operator/toPromise';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client'
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';

const AuthToken = gql`
mutation AuthToken ($input: GetAuthTokenInput!){
  getAuthToken(input: $input) {
    authToken
    success
    expiresIn
    message
  }
}
`;

interface MutationResponse {
  getAuthToken: {
    authToken: string,
    success: boolean,
    expiresIn: number,
    message: string
  }
}


@Injectable()
export class AuthService {
  private authenticated = false;
  private token: string;
  private expires = 0;
  private expiresTimerId: any = null;
  private userAuthenticationUrl = 'api/authenticateUser';

  constructor(private http: HttpClient,
    private router: Router,
    private apollo: Apollo) {
    this.token = localStorage.getItem('_token');
  }

  logout() {
    this.authenticated = false;
    this.expiresTimerId = null;
    this.expires = 0;
    this.token = null;
    this.router.navigate(['/login']);
  }

  getUserToken = (user: User): Observable<ApolloQueryResult<MutationResponse>> =>
    this.apollo.mutate<MutationResponse>({
      mutation: AuthToken,
      variables: {
        input: user
      }
    })

  private setToken = (token, expiresSeconds) => {
    this.token = token;
    if (this.token) {
      this.authenticated = true;
      this.startExpiresTimer(expiresSeconds);
      this.expires = new Date().setSeconds(new Date().getSeconds() + expiresSeconds);
    }
    localStorage.setItem('_token', this.token);
  }

  authenticateUser = (user) =>
    new Observable(observer => {
      return this.getUserToken(user)
        .subscribe(({ data }) => {
          const response = data.getAuthToken;
          if (response.success === false) {
            observer.next(new Error(response.message))
            observer.complete();
          }

          this.setToken(response.authToken, response.expiresIn)

          this.router.navigate(['products'])
          observer.complete();
        }, (error) => {
          console.log('there was an error sending the query', error);
        })
    })

  public isAuthenticated = () => this.authenticated;

  public timerExpired() {
    this.logout();
    alert('Seu token expirou, faça login novamente');
    console.log('Session has been cleared');
  }

  private startExpiresTimer(seconds: number) {
    if (this.expiresTimerId != null) {
      clearTimeout(this.expiresTimerId);
    }
    this.expiresTimerId = setTimeout(() => {
      console.log('Session has expired');
      this.timerExpired();
    }, seconds * 1000); // seconds * 1000, as setTimeout handles miliseconds
    console.log('Token expiration timer set for', seconds, 'seconds');
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
