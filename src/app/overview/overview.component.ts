import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalStorageService } from 'ng2-webstorage';
import { Observable } from 'rxjs';
import { Tag } from '../shared/interfaces/tag';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})

export class overviewComponent implements OnInit {
  public tags: FirebaseListObservable<Tag[]>;
  private teamKey: string;
  private uid: string;
  private filterTags: any;
  private activeTags: any[] = [];

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
    this.localStorage
      .observe('team')
      .subscribe((team) => {
        // Update team key if team was changed.
        this.teamKey = team.$key;

        // Update notes in view for the active tags.
        this.loadNotesForActiveTags(this.activeTags);
      });

    // Load the tags from database.
    this.tags = this.angularFire.database.list('/tags');

    // Store filter tags to be shown on the page.
    // These tags are used to filter the notes that are shown on the page.
    this.localStorage.store('filterTags', []);

    // Load the notes to be shown on the page by the selected filter tags.
    this.localStorage
      .observe('filterTags')
      .subscribe((filterTags) => {
        this.activeTags = filterTags ? filterTags : [];

        this.loadNotesForActiveTags(this.activeTags);
      });
  }

  /**
   * Returns true if the specified tag is active.
   *
   * @param tag The filter tag to check if it is an active filter tag.
   * @returns {boolean} True if the tag is an active filter.
   */
  isFilterTagActive(tag) {
    return this.activeTags.indexOf(tag.$key) > -1;
  }

  /**
   * Toggles the filter tag to be active or inactive, depending on its current state.
   *
   * @param tagKey The tag key.
   */
  toggleTagFilter(tagKey) {
    let filterTags = this.localStorage.retrieve('filterTags');

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

  private loadNotesForActiveTags(activeTags) {
    return this.angularFire.database.list('/notes/' + this.teamKey)
      .map(notes => {
        this.filterTags = notes
          .filter(note => {
            if (note.hasOwnProperty('tags')) {
              return note.tags.filter(noteTag => activeTags.indexOf(noteTag) !== -1).length > 0;
            }

            return false;
          })
          .map(note => {
            note.user$ = this.angularFire.database.object('/users/' + note.user);

            if (note.hasOwnProperty('tags') && note.tags.length > 0) {
              note.tags$ = Observable.of(note.tags.map(tag => this.angularFire.database.object('/tags/' + tag)));
            } else {
              note.tags$ = Observable.of([]);
            }

            return note;
          });

      }).subscribe();
  }
}
