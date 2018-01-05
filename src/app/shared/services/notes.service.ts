import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Note, NoteTypes, Tag, Tags, ActionStatusTypes } from '../models/';
import {DecisionStatuses} from '../models/decision-statuses.model';

@Injectable()
export class NotesService {
  public tags$: ReplaySubject<boolean> = new ReplaySubject(1);
  public noteTypes$: ReplaySubject<NoteTypes> = new ReplaySubject(1);
  public statuses$: ReplaySubject<DecisionStatuses> = new ReplaySubject(1);

  private tags: Tags;
  private noteTypes: NoteTypes;
  private actionStatusTypes: ActionStatusTypes;
  private statuses: DecisionStatuses;
  private madId: string;
  private sadId: string;
  private gladId: string;
  private actionPointId: string;
  private decisionId: string;
  private doneId: string;
  private experimentStatusId: string;
  private validStatusId: string;
  private rejectedStatusId: string;

  /**
   * Constructor of the class
   *
   * @param {AngularFire} angularFire
   */
  constructor (private angularFire: AngularFire) {

    this.tags$.next(false);

    // Get all tags with single database call instead of n calls to get the different types separately.
    this.angularFire.database
      .list('tags', {
        query: {
          orderByChild: 'type',
        }
      })
      .subscribe((tags: Array<Tag>) => {
        // Filter so that only those object that have type property are left
        const verifiedTags = tags.filter(tag => tag.hasOwnProperty('type'));

        this.initializeMadSadGladTags(verifiedTags);
        this.initializeNoteTypesTags(verifiedTags);
        this.initializeActionStatusTags(verifiedTags);
        this.initializeDecisionStatusTags(verifiedTags);
      });
  }

  private initializeMadSadGladTags(verifiedTags: Tag[]) {
    const madSadGladTags = verifiedTags.filter(tag => tag.type === 'MadSadGlad');

    madSadGladTags.forEach(tag => {
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
    });

    this.tags = {
      Mad: this.madId,
      Sad: this.sadId,
      Glad: this.gladId
    };

    this.tags$.next(true);
  }

  private initializeNoteTypesTags(verifiedTags: Tag[]) {
    const noteTypesTags = verifiedTags.filter(tag => tag.type === 'noteType');

    noteTypesTags.forEach(tag => {
      switch (tag.name) {
        case 'Action Point':
          this.actionPointId = tag.$key;
          break;
        case 'Decision':
          this.decisionId = tag.$key;
          break;
      }
    });

    this.noteTypes = {
      ActionPoint: this.actionPointId,
      Decision: this.decisionId,
    };

    this.noteTypes$.next(this.noteTypes);
  }

  private initializeActionStatusTags(verifiedTags: Tag[]) {
    const actionStatusTags = verifiedTags.filter(tag => tag.type === 'actionStatus');

    actionStatusTags.forEach(tag => {
      switch (tag.name) {
        case 'Done':
          this.doneId = tag.$key;
          break;
      }
    });

    this.actionStatusTypes = {
      Done: this.doneId,
    };
  }

  private initializeDecisionStatusTags(verifiedTags: Tag[]) {
    const decisionStatusTags = verifiedTags.filter(tag => tag.type === 'DecisionStatus');

    decisionStatusTags.forEach(tag => {
      switch (tag.name) {
        case 'Experiment':
          this.experimentStatusId = tag.$key;
          break;
        case 'Valid':
          this.validStatusId = tag.$key;
          break;
        case 'Rejected':
          this.rejectedStatusId = tag.$key;
          break;
      }
    });

    this.statuses = {
      Experiment: this.experimentStatusId,
      Valid: this.validStatusId,
      Rejected: this.rejectedStatusId
    };

    this.statuses$.next(this.statuses);
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
      .map(notes => {
        notes = notes.map(note => {
          note.user$ = this.angularFire.database.object(`/users/${note.user}`);

          if (note.hasOwnProperty('tags') && note.tags.length > 0) {
            note.tags$ = Observable.of(note.tags.map(tag => this.angularFire.database.object('/tags/' + tag)));
          } else {
            note.tags$ = Observable.of([]);
          }

          return note;
        });

        const copyOfResults = [...notes];

        // re-organize notes so that list contains only notes (entities without parent)
        // and add 'comments'(entities with parent) as sub-notes, then filter by the specified tag
        return notes
          .filter(note => {
            return !(note.hasOwnProperty('parentNote') && note.parentNote !== '') &&
              note.hasOwnProperty('tags') && note.tags.includes(this.tags[type]);
          })
          .map(note => {
            note.notes = copyOfResults.filter(_note => _note.parentNote === note.$key);

            return note;
          });
      });
  }

  /**
   * Getter method for note types. Excludes items with action status 'Done'.
   *
   * @param {string} teamKey  Current team firebase $key
   * @param {string} type     Note type one of following: 'ActionPoint' or 'Decision'
   * @returns {Observable<Array<Note>>}
   */
  public getNoteTypes(teamKey: string, type: string, status: string): Observable<Array<Note>> {
    let notes = this.angularFire.database
      .list(`/notes/${teamKey}`)
      .map(mapNotes => mapNotes.filter(note =>
        note.hasOwnProperty('tags') &&
        note.tags.includes(this.noteTypes[type]) &&
        !note.tags.includes(this.actionStatusTypes['Done'])));

    if (status !== '') {
      notes = notes.map(mapNotes => mapNotes.filter(note => note.hasOwnProperty('tags') && note.tags.includes(this.statuses[status])));
    }

    return notes.map(mapNotes => {
        return mapNotes.map((note) => {
          note.user$ = this.angularFire.database.object(`/users/${note.user}`);

          return note;
        });
      });
  }

  public changeDecisionStatus(teamKey: string, noteKey: string, existingDecision: Note, status: string) {
    const decision = {
      text: existingDecision.text,
      parentNote: existingDecision.parentNote,
      retro: existingDecision.retro,
      team: existingDecision.team,
      user: existingDecision.user,
      tags: existingDecision.tags,
      createdAt: existingDecision.createdAt,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    // remove old status tags
    let toRemove = decision.tags.indexOf(this.statuses['Experiment']);
    if (toRemove > -1) {
      decision.tags.splice(toRemove, 1);
    }
    toRemove = decision.tags.indexOf(this.statuses['Valid']);
    if (toRemove > -1) {
      decision.tags.splice(toRemove, 1);
    }
    toRemove = decision.tags.indexOf(this.statuses['Rejected']);
    if (toRemove > -1) {
      decision.tags.splice(toRemove, 1);
    }

    // add new status tag
    decision.tags.push(this.statuses[status]);

    // save changes
    this.angularFire.database.list(`/notes/${teamKey}`).update(noteKey, decision);
  }

  addActionPointStatusDone(teamKey: string, actionPointKey: string, actionPoint: Note) {
    actionPoint.tags.push(this.actionStatusTypes.Done);

    this.angularFire.database.object(`/notes/${teamKey}/${actionPointKey}/tags`).update(actionPoint.tags);
  }
}
