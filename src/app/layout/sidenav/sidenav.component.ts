import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { LocalStorageService } from 'ng2-webstorage';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

import 'rxjs';

import { TeamService } from '../../shared/services/';
import { Team } from '../../shared/models/';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent implements OnInit {
  public username: string;
  public teams$: Observable<Array<Team>>;
  public selectedTeam: any;

  /**
   * Constructor of the class
   *
   * @param {AngularFire}         angularFire
   * @param {Router}              router
   * @param {LocalStorageService} localStorage
   * @param {TeamService}         teamService
   */
  public constructor(
    public angularFire: AngularFire,
    private router: Router,
    private localStorage: LocalStorageService,
    private teamService: TeamService
  ) { }

  /**
   * On init life cycle method hook
   */
  public ngOnInit(): void {
    this.angularFire.auth.subscribe((auth) => {
      if (auth) {
        this.username = auth.google.displayName;
        this.teams$ = this.angularFire.database.list('/teams');
      } else {
        this.username = '';
        this.teams$ = Observable.of([]);
      }
    });

    this.teamService.team$
      .subscribe((team: Team) => {
        this.selectedTeam = team;
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
      })
      .catch(error => {
        alert(error);
      })
    ;
  }

  /**
   * Method to select team
   *
   * @param {Team}  team
   */
  public selectTeam(team: Team) {
    this.localStorage.store('team', team);
  }

  /**
   * Stores a user to database if not yet existing.
   */
  private storeUserToDatabase() {
    const firebaseUser = firebase.auth().currentUser;
    const newUser = {
      name: firebaseUser.displayName,
      email: firebaseUser.email,
      uid: firebaseUser.uid,
    };

    this.angularFire.database.list('/users', {
      query: {
        orderByChild: 'uid',
        equalTo: firebaseUser.uid,
        limitToFirst: 1
      }
    })
    .take(1)
    .do(user => {
      if (user.length === 0) {
        this.angularFire.database.list('/users').push(newUser);
      }

      this.router.navigate(['/teams']);
    })
    .subscribe();
  }
}
