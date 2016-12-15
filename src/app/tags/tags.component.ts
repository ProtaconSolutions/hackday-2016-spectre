import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})

export class TagsComponent implements OnInit {
  public tags: FirebaseListObservable<any[]>;
  public tag: string = '';
  public type: string = '';

  /**
   * Constructor
   *
   * @param {AngularFire} angularFire
   */
  public constructor(private angularFire: AngularFire) { }

  public ngOnInit() {
    this.tags = this.angularFire.database.list('/tags');
  }

  public addNewTag() {
    let tagItem = {
      name: this.tag,
      type: this.type,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    };

    this.tags.push(tagItem);
    this.tag = '';
  }

  public removeTag(tag) {
    this.tags.remove(tag.$key);
  }
}
