import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalStorageService } from 'ng2-webstorage';
import * as firebase from 'firebase';
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
  private foos: any;
  private enabled: any[] = [];

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
    this.tags = this.angularFire.database.list('/tags');
    this.localStorage.store('foos', []);

    this.localStorage
      .observe('foos')
      .subscribe((value) => {
        this.enabled = value ? value : [];

        this.getNotes(value);
      });
  }

  isEnabled(tag) {
    return this.enabled.indexOf(tag.$key) > -1;
  }

  toggle(item) {
    let items = this.localStorage.retrieve('foos');

    if (items.indexOf(item) === -1) {
      items.push(item);
    } else {
      items.splice(items.indexOf(item), 1);
    }

    this.localStorage.store('foos', items);
  }

  private getNotes(value) {
    return this.angularFire.database.list('/notes/' + this.teamKey)
      .map(results => {
        this.foos = results
          .filter(note => {
            if (note.hasOwnProperty('tags')) {
              return note.tags.filter(n => value.indexOf(n) !== -1).length > 0;
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
