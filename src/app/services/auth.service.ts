import { Injectable } from '@angular/core';
import { HttpClient } from '../httpClient';
import 'rxjs/add/operator/toPromise';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const AuthToken = gql`
mutation AuthToken ($input: GetAuthTokenInput!){
  getAuthToken(input: $input) {
    authToken
    success
    expiresIn
  }
}
`;

interface Node {
  node: {
    _id: string,
    name: string,
    price: number,
    category: string
  }
}


interface MutationResponse {
  getAuthToken: {
    authToken: string,
    success: boolean,
    expiresIn: number
  }
}


@Injectable()
export class AuthService {
  private authenticated = false;
  private token: string;
  private expires: any = 0;
  private expiresTimerId: any = null;
  private userAuthenticationUrl = 'api/authenticateUser';

  constructor(private http: HttpClient,
    private router: Router,
    private apollo: Apollo) {
    this.token = localStorage.getItem('_token');
  }

  getToken() {
    console.log(this.token);
  }

  logout() {
    this.authenticated = false;
    this.expiresTimerId = null;
    this.expires = 0;
    this.token = null;
    this.router.navigate(['/login']);
  }

  async authenticateUser(user: User): Promise<any> {
    try {
      return await this.apollo.mutate<MutationResponse>({
        mutation: AuthToken,
        variables: {
          input: user
        }
      }).subscribe(({ data }) => {
        const response = data.getAuthToken;
        this.token = response.authToken;
        if (response.success === false) {
          throw response
        };
        const expiresSeconds = response.expiresIn;
        if (this.token) {
          this.authenticated = true;
          this.startExpiresTimer(expiresSeconds);
          this.expires = new Date();
          this.expires = this.expires.setSeconds(this.expires.getSeconds() + expiresSeconds);
        }
        localStorage.setItem('_token', this.token);
        this.router.navigate(['products'])
        return this.token;
      }, (error) => {
        console.log('there was an error sending the query', error);
      })
    } catch (e) {

      console.log('---TESTE CATCH');
      this.handleError(e);
    }
  }

  public isAuthenticated() {
    return this.authenticated;
  }

  public doLogout() {
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
      this.doLogout();
    }, seconds * 1000); // seconds * 1000
    console.log('Token expiration timer set for', seconds, 'seconds');
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
