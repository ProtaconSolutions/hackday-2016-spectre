import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalStorageService } from 'ng2-webstorage';
import { Observable } from 'rxjs/Observable';

import { Note, Tag, Team } from '../shared/models/';
import { TeamService } from '../shared/services/';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})

export class OverviewComponent implements OnInit {
  public tags$: FirebaseListObservable<Tag[]>;
  public notes$: Observable<Array<Note>>;

  private teamKey: string;
  private activeTags: Array<Tag> = [];

  /**
   * Constructor of the class.
   *
   * @param {AngularFire}         angularFire
   * @param {LocalStorageService} localStorage
   * @param {TeamService}         teamService
   */
  public constructor(
    private angularFire: AngularFire,
    private localStorage: LocalStorageService,
    private teamService: TeamService
  ) { }

  /**
   * On init lifecycle hook, in here we want to do following:
   *  1) subscribe to team changes
   *    1.1) when ever team changes we want to fetch notes again
   *  2) subscribe to filter tags changes (these are what use can select from GUI)
   *    2.1) when ever these are changed we want to fetch notes again
   */
  public ngOnInit(): void {
    /**
     * Store filter tags to be shown on the page.
     * These tags are used to filter the notes that are shown on the page.
     */
    this.localStorage.store('filterTags', []);

    // Load the tags from database.
    this.tags$ = this.angularFire.database.list('/tags');

    this.teamService.team$
      .subscribe((team: Team) => {
        if (!team) {
          return;
        }

        this.teamKey = team.$key;

        this.notes$ = this.fetchNotes(this.activeTags);
      });

    // Load the notes to be shown on the page by the selected filter tags.
    this.localStorage
      .observe('filterTags')
      .subscribe((filterTags) => {
        this.activeTags = filterTags ? filterTags : [];

        this.notes$ = this.fetchNotes(this.activeTags);
      });
  }

  /**
   * Returns true if the specified tag is active.
   *
   * @param tag The filter tag to check if it is an active filter tag.
   * @returns {boolean} True if the tag is an active filter.
   */
  public isFilterTagActive(tag): boolean {
    return this.activeTags.indexOf(tag.$key) > -1;
  }

  /**
   * Toggles the filter tag to be active or inactive, depending on its current state.
   *
   * @param {string}  tagKey The tag key.
   */
  toggleTagFilter(tagKey: string): void {
    const filterTags = this.localStorage.retrieve('filterTags');

    if (filterTags.indexOf(tagKey) === -1) {
      // The tag was not found in the filter tags. => Add it as one of the active filters.
      filterTags.push(tagKey);
    } else {
      // The tag was found in the filter tags. => Remove one filter at the index the filter tag is found.
      filterTags.splice(filterTags.indexOf(tagKey), 1);
    }

    // Updates the filter tags with the change.
    this.localStorage.store('filterTags', filterTags);
  }

  /**
   * Method to fetch notes for current team with currently selected tags.
   *
   * @param {Array<Tag>}  activeTags
   * @returns {Observable<Array<Note>>}
   */
  private fetchNotes(activeTags: Array<Tag>): Observable<Array<Note>> {
    return this.angularFire.database
      .list(`/notes/${this.teamKey}`)
      .map(notes => {
        return notes
          .filter(note => {
            if (note.hasOwnProperty('tags')) {
              return note.tags.filter(noteTag => activeTags.indexOf(noteTag) !== -1).length > 0;
            }

            return false;
          })
          .map(note => {
            note.user$ = this.angularFire.database.object(`/users/${note.user}`);

            if (note.hasOwnProperty('tags') && note.tags.length > 0) {
              note.tags = Observable.of(note.tags.map(tag => this.angularFire.database.object(`/tags/${tag}`)));
            } else {
              note.tags = Observable.of([]);
            }

            return note;
          });
      });
  }
}
