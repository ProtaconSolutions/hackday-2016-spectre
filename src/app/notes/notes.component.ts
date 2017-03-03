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
  public retroStarted: boolean;
  public commentTypeKey: string;

  private uid: string;
  private users: any[];
  private openRetro: any;

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
    this.notes = this.getOpenNotesByTeamKey(teamKey);
    this.getOpenRetroByTemKey(teamKey);

    this.localStorage
      .observe('team')
      .subscribe((team) => {
        this.notes = this.getOpenNotesByTeamKey(team.$key);
        this.getOpenRetroByTemKey(team.$key);
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

      this.angularFire.database.list('tags', {
        query: {
          orderByChild: 'type',
          equalTo: 'noteType',
        }
      }).map(types => types.filter(item => item.hasOwnProperty('name') && item.name === 'Comment'))
        .subscribe(value => {this.commentTypeKey = value[0].$key; });
  }

  public addNewNote(parent?: string) {
    const teamKey = this.localStorage.retrieve('team').$key;

    // Resolve comment type. Use 'Comment' as default.
    // 'Decisions' and 'Action Points' are allowed only when there is 'open' retrospective
    let commentType = this.commentType ? this.commentType : this.commentTypeKey;

    // create entity
    let note = {
      parentNote: parent ? parent : '',
      team: teamKey,
      text: parent ? this.note2 : this.note,
      user: this.uid,
      retro: '',
      tags: [parent ? commentType : this.noteType],
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    this.angularFire.database.list('/notes/' + teamKey).push(note);

    // clear inputs
    this.note = '';
    this.note2 = '';
  }

  private getOpenNotesByTeamKey(teamKey) {
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

  private getOpenRetroByTemKey(teamKey) {

    this.angularFire.database.list('/retros/'+teamKey)
      .map(retros => retros.filter(retro => !(retro.hasOwnProperty('updatedAt') && retro.updatedAt > 0)))
      .subscribe(value => {
        this.retroStarted = value.length > 0;
        if(this.retroStarted)
        {
          this.openRetro = value[0];
        }
      });
  }

  private startRetrospective() {
    const teamKey = this.localStorage.retrieve('team').$key;

    let retro = {
      name: 'Sprint retro',
      team: teamKey,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: 0
    };

    this.angularFire.database.list('/retros/' + teamKey).push(retro);
  }

  private completeRetrospective(retroKey) {
    const teamKey = this.localStorage.retrieve('team').$key;

    let retro = {
      name: this.openRetro.name,
      team: this.openRetro.team,
      createdAt: this.openRetro.createdAt,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    this.angularFire.database.list('/retros/' + teamKey).update(retroKey, retro);
  }
}
