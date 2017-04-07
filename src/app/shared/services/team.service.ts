import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { LocalStorageService } from 'ng2-webstorage';

@Injectable()
export class TeamService {
  public team$: ReplaySubject<any> = new ReplaySubject(1);

  private team: any;

  /**
   * Constructor of the class
   *
   */
  public constructor(private localStorage: LocalStorageService) {
    this.team$.next(this.localStorage.retrieve('team'));

    this.localStorage
      .observe('team')
      .subscribe(team => {
        this.team = team;

        this.team$.next(this.team);
      });
  }
}
