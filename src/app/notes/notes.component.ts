import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import {LocalStorageService} from "ng2-webstorage";
import {Note} from "../shared/interfaces/note";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})

export class NotesComponent implements OnInit {
  public notes: FirebaseListObservable<Note[]>;

  /**
   * Constructor
   *
   * @param {AngularFire} angularFire
   * @param {LocalStorageService} localStorage
   */
  constructor(
    private angularFire: AngularFire,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit() {
    // TODO: Retrieve child-notes (perhaps separately) and link them to the retrieved notes.
    this.notes = this.getNotesByTeamKey(this.localStorage.retrieve('team').$key);

    this.localStorage
      .observe('team')
      .subscribe((value) => {
        this.notes = this.getNotesByTeamKey(value.$key);
      });
  }

  private getNotesByTeamKey(teamKey)
  {
    return this.angularFire.database.list('/notes/' + teamKey);
  }
}
