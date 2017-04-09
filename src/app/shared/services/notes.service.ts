import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

import { Note, NoteTypes, Tag, Tags } from '../models/';

@Injectable()
export class NotesService {
  public tags$: ReplaySubject<Tags> = new ReplaySubject(1);
  public noteTypes$: ReplaySubject<NoteTypes> = new ReplaySubject(1);

  private tags: Tags;
  private noteTypes: NoteTypes;
  private madId: string;
  private sadId: string;
  private gladId: string;
  private actionPointId: string;
  private decisionId: string;

  /**
   * Constructor of the class
   *
   * @param {AngularFire} angularFire
   */
  constructor (private angularFire: AngularFire) {
    if (!this.tags) { // Ensure that we have 'something' in replay subject
      this.tags$.next(new Tags);
    }

    this.angularFire.database
      .list('tags', {
        query: {
          orderByChild: 'type',
          equalTo: 'MadSadGlad',
        }
      })
      .subscribe((tags: Array<Tag>) => {
        tags.forEach(tag => {
          switch (tag.name) {
            case 'Mad':
              this.madId = tag.$key;
              break;
            case 'Sad':
              this.sadId = tag.$key;
              break;
            case 'Glad':
              this.gladId = tag.$key;
              break;
          }

          this.tags = {
            Mad: this.madId,
            Sad: this.sadId,
            Glad: this.gladId
          };

          this.tags$.next(this.tags);
        });
      });

    this.angularFire.database
      .list('tags', {
        query: {
          orderByChild: 'type',
          equalTo: 'noteType',
        }
      })
      .subscribe((tags: Array<Tag>) => {
        tags.forEach(tag => {
          switch (tag.name) {
            case 'Action Point':
              this.actionPointId = tag.$key;
              break;
            case 'Decision':
              this.decisionId = tag.$key;
              break;
          }

          this.noteTypes = {
            ActionPoint: this.actionPointId,
            Decision: this.decisionId,
          };

          this.noteTypes$.next(this.noteTypes);
        });
      });
  }

  /**
   * Getter method for notes
   *
   * @param {string} teamKey  Current team firebase $key
   * @param {string} type     Notes type one of following: 'Sad', 'Mad' or 'Glad'
   * @returns {Observable<Array<Note>>}
   */
  public getNotes(teamKey: string, type: string): Observable<Array<Note>> {
    return this.angularFire.database
      .list(`/notes/${teamKey}`)
      .map(notes => notes.filter(note => note.hasOwnProperty('tags') && note.tags.includes(this.tags[type])));
  }

  /**
   * Getter method for note types
   *
   * @param {string} teamKey  Current team firebase $key
   * @param {string} type     Note type one of following: 'ActionPoint' or 'Decision'
   * @returns {Observable<Array<Note>>}
   */
  public getNoteTypes(teamKey: string, type: string): Observable<Array<Note>> {
    return this.angularFire.database
      .list(`/notes/${teamKey}`)
      .map(notes => notes.filter(note => note.hasOwnProperty('tags') && note.tags.includes(this.noteTypes[type])))
      .map(notes => {
        return notes.map((note) => {
          note.user$ = this.angularFire.database.object(`/users/${note.user}`);

          return note;
        });
      });
  }
}
