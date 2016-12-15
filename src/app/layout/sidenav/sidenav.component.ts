import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';

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

  public logout() {
    this.angularFire.auth.logout();
    this.localStorage.clear();

    return this.router.navigate(['/login']);
  }

  public selectTeam(team) {
    this.localStorage.store('team', team);
  }
}
