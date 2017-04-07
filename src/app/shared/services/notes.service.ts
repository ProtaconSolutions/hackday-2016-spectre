import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

import { Note, Tag, Tags } from '../models/';

@Injectable()
export class NotesService {
  public tags$: ReplaySubject<Tags> = new ReplaySubject(1);

  private tags: Tags;
  private madId: string;
  private sadId: string;
  private gladId: string;

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
}
