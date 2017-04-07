import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { LocalStorageService } from 'ng2-webstorage';

import { Team } from '../models/';

@Injectable()
export class TeamService {
  public team$: ReplaySubject<Team> = new ReplaySubject(1);

  private team: Team;

  /**
   * Constructor of the class
   *
   * @param {LocalStorageService} localStorage
   */
  public constructor(private localStorage: LocalStorageService) {
    this.team$.next(this.localStorage.retrieve('team'));

    this.localStorage
      .observe('team')
      .subscribe((team: Team) => {
        this.team = team;

        this.team$.next(this.team);
      });
  }
}
