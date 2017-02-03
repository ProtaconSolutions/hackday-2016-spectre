import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalStorageService } from 'ng2-webstorage';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})

export class NotesComponent implements OnInit {
  public notes: any;
  public note: string;
  public note2: string;
  public noteTypes: any;
  public noteType: string;
  public commentTypes: any;
  public commentType: string;
  public openRetros: any;
  public retroStarted: boolean;

  private teamKey: string;
  private uid: string;
  private users: any[];

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
    this.notes = this.getNotesByTeamKey(this.localStorage.retrieve('team').$key);

    this.localStorage
      .observe('team')
      .subscribe((value) => {
        this.notes = this.getNotesByTeamKey(value.$key);
      });

    // get note types e.g. Mad/Sad/Glad
    this.noteTypes = this.angularFire.database.list('/tags', {
      query: {
        orderByChild: 'type',
        equalTo: 'MadSadGlad',
      }
    });

    // Note is 'first level' item and comments are sub-items of note
    // get comment types e.g. Comment/Decision/ActionPoint
    this.commentTypes = this.angularFire.database.list('/tags', {
      query: {
        orderByChild: 'type',
        equalTo: 'noteType',
      }
    });

    this.openRetros = this.angularFire.database.list('/retros/'+this.teamKey).map(retros => retros.filter(retro => !(retro.hasOwnProperty('updatedAt'))));
    this.openRetros.subscribe(x => this.retroStarted = x.length > 0);
  }

  public addNewNote(parent?: string) {
    const teamKey = this.localStorage.retrieve('team').$key;

    // Resolve comment type. Use 'Comment' as default.
    // 'Decisions' and 'Action Points' are allowed only when there is 'open' retrospective
    let commentType = this.commentType ? this.commentType : 'Comment';

    // create entity
    let note = {
      parentNote: parent ? parent : '',
      team: teamKey,
      text: parent ? this.note2 : this.note,
      user: this.uid,
      tags: [parent ? commentType : this.noteType],
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    this.angularFire.database.list('/notes/' + teamKey).push(note);

    // clear inputs
    this.note = '';
    this.note2 = '';
  }

  private getNotesByTeamKey(teamKey) {
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

        const copyOfResults = [...results];

        // re-organize notes so that list contains only notes (entities without parent)
        // and add 'comments'(entities with parent) as sub-notes
        return results
          .filter(note => !(note.hasOwnProperty('parentNote') && note.parentNote !== ''))
          .map(note => {
            note.notes = copyOfResults.filter(_note => _note.parentNote === note.$key);

            return note;
          })
        ;
      });
  }

  private startRetrospective() {
  }

  private completeRetrospective() {

  }
}
