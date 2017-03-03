import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalStorageService } from 'ng2-webstorage';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-warboard',
  templateUrl: './warboard.component.html',
  styleUrls: ['./warboard.component.scss']
})
export class WarboardComponent implements OnInit {
  public actionPoints: any;
  public decisions: any;

  private uid: string;

  /**
   * Constructor
   *
   * @param {AngularFire} angularFire
   * @param {LocalStorageService} localStorage
   */
  constructor(
    private angularFire: AngularFire,
    private localStorage: LocalStorageService
  ) {
    this.uid = localStorage.retrieve('uid');
  }

  ngOnInit() {
    const teamKey = this.localStorage.retrieve('team').$key;

    this.actionPoints = this.getOpenActionPointsByTeamKey(teamKey);
  }

  private getOpenActionPointsByTeamKey(teamKey) {
    return null;
  }

}
