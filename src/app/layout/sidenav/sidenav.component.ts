import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods } from 'angularfire2';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import * as firebase from 'firebase';
import 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent implements OnInit {
  public username: string;
  public teams: FirebaseListObservable<any[]>;
  public selectedTeam: any;

  public constructor(
    private angularFire: AngularFire,
    private router: Router,
    private localStorage: LocalStorageService
  ) { }

  public ngOnInit() {
    this.angularFire.auth.subscribe((auth) => {
      if (auth) {
        this.username = auth.google.displayName;
        this.teams = this.angularFire.database.list('/teams');
      } else {
        this.username = '';
      }
    });

    this.localStorage
      .observe('team')
      .subscribe((value) => {
        this.selectedTeam = value;
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

  public selectTeam(team) {
    this.localStorage.store('team', team);
  }

  /**
   * Stores a user to database if not yet existing.
   */
  private storeUserToDatabase() {
    let firebaseUser = firebase.auth().currentUser;
    let newUser = {
      name: firebaseUser.displayName,
      email: firebaseUser.email
    };

    this.angularFire.database.list('/users', {
      query: {
        orderByChild: 'name',
        equalTo: firebaseUser.displayName,
        limitToFirst: 1
      }
    })
    .take(1)
    .do(user => {
      if (user.length === 0) {
        this.angularFire.database.list('/users').push(newUser);
      }
    })
    .subscribe();
  }
}
