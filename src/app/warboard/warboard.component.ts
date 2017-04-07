import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalStorageService } from 'ng2-webstorage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-warboard',
  templateUrl: './warboard.component.html',
  styleUrls: ['./warboard.component.scss']
})
export class WarboardComponent implements OnInit {
  public actionPoints: any;
  public decisions: any;

  public actionPointTag: any;

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

    // get action point note type
    this.angularFire.database.list('/tags', {
      query: {
        orderByChild: 'type',
        equalTo: 'noteType',
      }
    })
    .subscribe(tags => {
      tags.forEach(tag => {
        if(tag.hasOwnProperty('name') && tag.name === 'Decision') {
          this.actionPointTag = tag.$key;
        }
      })
    });

    this.actionPoints = this.getOpenActionPointsByTeamKey(teamKey);

    this.localStorage
      .observe('team')
      .subscribe((team) => {
        this.actionPoints = this.getOpenActionPointsByTeamKey(team.$key);
      });
  }

  private getOpenActionPointsByTeamKey(teamKey) {

    return this.angularFire.database.list('/notes/' + teamKey)
      .map(results => {
        results = results.map(note => {
          note.user$ = this.angularFire.database.object('/users/' + note.user);

          if (note.hasOwnProperty('tags') && note.tags.length > 0) {
            note.tags$ = Observable.of(note.tags.map(tag => this.angularFire.database.object('/tags/' + tag)));
          } else {
            note.tags$ = Observable.of([]);
          }

          return note;
        });

        return results
          .filter(note => (note.hasOwnProperty('tags') && note.tags.filter(noteTag => noteTag === this.actionPointTag).length > 0))
          .filter(note => (note.hasOwnProperty('retro') && note.retro !== ''));
      });
  }

}
