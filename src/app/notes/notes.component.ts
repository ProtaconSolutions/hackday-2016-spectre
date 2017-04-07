import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { LocalStorageService } from 'ng2-webstorage';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

import { TeamService } from '../shared/services/team.service';
import { Note, Tag, Team } from '../shared/models/';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})

export class NotesComponent implements OnInit {
  public notes: any;
  public note: string;
  public note2: string;
  public noteTypes$: Observable<Array<Note>>;
  public noteType: string;
  public commentTypes$: Observable<Array<Tag>>;
  public commentType: string;
  public retroStarted: boolean;
  public commentTypeKey: string;

  private uid: string;
  private users: any[];
  private openRetro: any;

  private teamKey: string;

  /**
   * Constructor
   *
   * @param {AngularFire}         angularFire
   * @param {LocalStorageService} localStorage
   * @param {TeamService}         teamService
   */
  constructor(
    private angularFire: AngularFire,
    private localStorage: LocalStorageService,
    private teamService: TeamService
  ) {
    this.uid = localStorage.retrieve('uid');
  }

  ngOnInit() {
    this.teamService.team$
      .subscribe((team: Team) => {
        this.teamKey = team.$key;

        this.notes = this.getOpenNotesByTeamKey();
        this.getOpenRetroByTemKey();
      });

    // get note types e.g. Mad/Sad/Glad
    this.noteTypes$ = this.angularFire.database
      .list('/tags', {
        query: {
          orderByChild: 'type',
          equalTo: 'MadSadGlad',
        }
      });

    /**
     * Note is 'first level' item and comments are sub-items of note
     * get comment types e.g. Comment / Decision / ActionPoint
     */
    this.commentTypes$ = this.angularFire.database
      .list('/tags', {
        query: {
          orderByChild: 'type',
          equalTo: 'noteType',
        }
      });

    this.angularFire.database
      .list('tags', {
        query: {
          orderByChild: 'type',
          equalTo: 'noteType',
        }
      })
      .map((tags: Array<Tag>) => tags.filter((tag: Tag) => tag.hasOwnProperty('name') && tag.name === 'Comment'))
      .subscribe(tag => {
        this.commentTypeKey = (tag[0] && tag[0].hasOwnProperty('$key')) ? tag[0].$key : null;
      });
  }

  public addNewNote(parent?: string) {
    // Resolve comment type. Use 'Comment' as default.
    // 'Decisions' and 'Action Points' are allowed only when there is 'open' retrospective
    let commentType = this.commentType ? this.commentType : this.commentTypeKey;

    // create entity
    let note = {
      parentNote: parent ? parent : '',
      team: this.teamKey,
      text: parent ? this.note2 : this.note,
      user: this.uid,
      retro: '',
      tags: [parent ? commentType : this.noteType],
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    this.angularFire.database.list(`/notes/${this.teamKey}`).push(note);

    // clear inputs
    this.note = '';
    this.note2 = '';
  }

  public startRetrospective() {
    let retro = {
      name: 'Sprint retro',
      team: this.teamKey,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: 0
    };

    this.angularFire.database.list(`/retros/${this.teamKey}`).push(retro);
  }

  public completeRetrospective(retroKey) {
    this.linkOpenNotesToRetro(retroKey);

    let retro = {
      name: this.openRetro.name,
      team: this.openRetro.team,
      createdAt: this.openRetro.createdAt,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    this.angularFire.database.list(`/retros/${this.teamKey}`).update(retroKey, retro);
  }

  private getOpenNotesByTeamKey() {
    return this.angularFire.database.list(`/notes/${this.teamKey}`)
      .map(results => {
        results = results.map(note => {
          note.user$ = this.angularFire.database.object(`/users/${note.user}`);

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
        // keep only notes not assigned to retrospective
        return results
          .filter(note => !(note.hasOwnProperty('parentNote') && note.parentNote !== '') && (!note.hasOwnProperty('retro') || note.retro === ''))
          .map(note => {
            note.notes = copyOfResults.filter(_note => _note.parentNote === note.$key);

            return note;
          });
      });
  }

  private getOpenRetroByTemKey() {
    this.angularFire.database.list(`/retros/${this.teamKey}`)
      .map(retros => retros.filter(retro => !(retro.hasOwnProperty('updatedAt') && retro.updatedAt > 0)))
      .subscribe(value => {
        this.retroStarted = value.length > 0;
        if (this.retroStarted) {
          this.openRetro = value[0];
        }
      });
  }

  private linkOpenNotesToRetro(retroKey){
    const noteList = this.angularFire.database.list(`/notes/${this.teamKey}`);

    const subscription = this.notes.subscribe(items => items.forEach((item) => {
      noteList.update(item.$key, {retro: retroKey});

      item.notes.forEach((child) => {
        noteList.update(child.$key, {retro: retroKey});
      });
    }));

    subscription.unsubscribe();
  }
}
