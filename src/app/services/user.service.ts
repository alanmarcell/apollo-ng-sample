import { Injectable } from '@angular/core';
import { HttpClient } from '../httpClient';
import 'rxjs/add/operator/toPromise';
import { User } from '../models/user';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client'
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';

const SaveUser = gql`
  mutation SaveUser($input: SaveUserInput!) {
    saveUser(input: $input) {
        userEdge {
            node {
                errors{
                  propName
                  errorMsg
                },
                id,
                userName,
                email,
                emailConfirmed,
                displayName,
                imgUrl
            }
        }
    }
}
`;

interface MutationResponse {
  saveUser: {
    userEdge: {
      node: {
        id: String
        userName: String
        email: String
        displayName: String
        password: String
        errors: any
      }
    }
  }
}


@Injectable()
export class UserService {

  private usersUrl = 'api/users';  // URL to web api

  constructor(
    private http: HttpClient,
    private apollo: Apollo) { }

  getUsers(): Promise<User[]> {
    return this.http.get(this.usersUrl)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getUser(id: string) {
    return this.http.get(this.usersUrl + '/' + id)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  save(user: User) {
    // if (user._id) {
    //   return this.put(user);
    // }
    return this.post(user);
  }

  delete(user: User) {

    const url = `${this.usersUrl}/${user._id}`;

    return this.http
      .delete(url)
      .toPromise()
      .catch(this.handleError);
  }

  private postOld(user: User): Promise<User> {
    return this.http
      .post(this.usersUrl, JSON.stringify(user))
      .toPromise()
      .then(response => {
        return response.json().data;
      })
      .catch(this.handleError);
  }

  saveUser = (user: User): Observable<ApolloQueryResult<MutationResponse>> =>
    this.apollo.mutate<MutationResponse>({
      mutation: SaveUser,
      variables: {
        input: user
      }
    });

  post = (user) =>
    new Observable(observer => {
      return this.saveUser(user)
        .subscribe(
        ({ data }) => {
          console.log('Observable data')
          console.log(data)
          if (data.saveUser.userEdge.node.errors) {
            console.log(data.saveUser.userEdge.node.errors[0])
            observer.error(data.saveUser.userEdge.node.errors)
          }
        },
        (error) => console.log('there was an error sending the query', error),
        () => observer.complete())
    })

  private put(user: User) {

    const url = `${this.usersUrl}/${user._id}`;

    return this.http
      .put(url, JSON.stringify(user))
      .toPromise()
      .then(() => user)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
