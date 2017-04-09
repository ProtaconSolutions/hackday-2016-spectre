import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { LocalStorageService } from 'ng2-webstorage';

import { TeamService } from '../../shared/services/';
import { Team } from '../../shared/models/';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  public team: Team;
  public uid: string;

  /**
   * Constructor of the class
   *
   * @param {AngularFire}         angularFire
   * @param {Router}              router
   * @param {LocalStorageService} localStorage
   * @param {TeamService}         teamService
   */
  public constructor(
    private angularFire: AngularFire,
    private router: Router,
    private localStorage: LocalStorageService,
    private teamService: TeamService,
  ) { }

  /**
   * On init life cycle hook method.
   */
  public ngOnInit(): void {
    this.teamService.team$
      .subscribe((team: Team) => {
        this.team = team;
      });

    this.localStorage
      .observe('uid')
      .subscribe((value: string) => {
        this.uid = value;
      });
  }

  /**
   * Method to logout current user.
   */
  public logout() {
    this.router.navigate(['/blank']).then(() => {
      this.angularFire.auth.logout();
      this.localStorage.clear();
    });
  }
}
