import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})

export class TeamsComponent implements OnInit {
  public teams: FirebaseListObservable<any[]>;
  public newTeamName: string = '';

  /**
   * Teams module constructor
   * @param angularFire
   */
  public constructor(private angularFire: AngularFire) { }

  public ngOnInit() {
    this.teams = this.angularFire.database.list('/teams');
  }

  public addTeamToDatabase(){
    let teamItem = {
      name: this.newTeamName,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    };
    this.teams.push(teamItem);
    this.newTeamName = '';
  }

  public removeTeam(team){
    this.teams.remove(team.$key)
  }
}
