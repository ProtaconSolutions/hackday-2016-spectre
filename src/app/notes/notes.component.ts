import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalStorageService } from 'ng2-webstorage';
import * as firebase from 'firebase';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})

export class NotesComponent implements OnInit {
  public notes: any;
  public note: string;
  public note2: string;

  private teamKey: string;
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
    this.teamKey = localStorage.retrieve('team').$key;
    this.uid = localStorage.retrieve('uid');
  }

  ngOnInit() {
    // TODO: Retrieve child-notes (perhaps separately) and link them to the retrieved notes.
    this.notes = this.getNotesByTeamKey(this.localStorage.retrieve('team').$key);

    this.localStorage
      .observe('team')
      .subscribe((value) => {
        this.notes = this.getNotesByTeamKey(value.$key);
      });
  }

  public addNewNote(parent?: string) {
    const teamKey = this.localStorage.retrieve('team').$key;

    let note = {
      parentNote: parent ? parent : '',
      team: teamKey,
      text: parent ? this.note2 : this.note,
      user: this.uid,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    this.angularFire.database.list('/notes/' + teamKey).push(note);

    this.note = '';
    this.note2 = '';
  }

  private getNotesByTeamKey(teamKey) {
    return this.angularFire.database.list('/notes/' + teamKey)
      .map(results => {
        let foo = [...results];

        return results
          .filter(note => !(note.hasOwnProperty('parentNote') && note.parentNote !== ''))
          .map(note => {
            note.notes = foo.filter(_note => _note.parentNote === note.$key);

            return note;
          })
        ;
      });
  }
}
