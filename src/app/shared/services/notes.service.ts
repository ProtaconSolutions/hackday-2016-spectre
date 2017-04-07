import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotesService {
  public tags$: ReplaySubject<any> = new ReplaySubject(1);

  private tags: any;
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
      this.tags$.next({});
    }

    this.angularFire.database
      .list('tags', {
        query: {
          orderByChild: 'type',
          equalTo: 'MadSadGlad',
        }
      })
      .subscribe(tags => {
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
   * @returns {Observable<any>}
   */
  public getNotes(teamKey: string, type: string): Observable<any[]> {
    return this.angularFire.database
      .list(`/notes/${teamKey}`)
      .map(notes => notes.filter(note => note.hasOwnProperty('tags') && note.tags.includes(this.tags[type])));
  }
}
