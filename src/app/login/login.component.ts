import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire, AuthMethods, AuthProviders } from 'angularfire2';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  /**
   * Constructor of the class.
   *
   * @param {AngularFire} angularFire
   * @param {Router}      router
   */
  public constructor(
    private angularFire: AngularFire,
    private router: Router
  ) { }

  /**
   * ngOnInit lifecycle hook.
   *
   * @see https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html
   */
  public ngOnInit() {
    this.angularFire.auth.subscribe(auth => {
      if (auth && auth.uid) {
        this.router.navigateByUrl('/teams');
      }
    });
  }

  /**
   * Method to login with specified provider.
   *
   * @param {string}  provider
   */
  public login(provider: string) {
    this.angularFire.auth
      .login({
        provider: AuthProviders[provider],
        method: AuthMethods.Popup,
      })
      .then(() => {
        this.storeUserToDatabase();
        this.router.navigate(['/teams']);
      })
      .catch(error => {
        alert(error);
      })
    ;
  }

  /**
   * Stores a user to database if not yet existing.
   */
  private storeUserToDatabase(){
    let firebaseUser = firebase.auth().currentUser;
    let newUser = {
      name: firebaseUser.displayName,
      email: firebaseUser.email
    };

    this.angularFire.database.list('/users', {
      query: {
        orderByChild: 'name',
        equalTo: firebaseUser.displayName
      }
    }).subscribe(users => {
      if (users.length === 0){
        this.angularFire.database.list('/users').push(newUser);
      }
    });
  }
}
