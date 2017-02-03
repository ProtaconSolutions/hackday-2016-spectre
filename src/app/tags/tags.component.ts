import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Tag } from "../shared/interfaces/tag";
import * as firebase from 'firebase';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})

export class TagsComponent implements OnInit {
  public tags: FirebaseListObservable<Tag[]>;
  public selectedTagKey: string = '';
  public selectedTag: Tag;
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
    let newTag = {
      name: this.tag,
      type: this.type,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    this.tags.push(newTag);

    // Clear selection.
    this.tag = '';
    this.type = '';
  }

  // TODO: Add editing, see example: https://jsfiddle.net/jaredwilli/QFZmn/
  /*
  public editTag(tag) {
    this.selectedTagKey = tag.$key;
    this.selectedTag = tag;
    this.tag = tag.name;
    this.type = tag.type;
  }
*/
  public removeTag(tag) {
    this.tags.remove(tag.$key);
  }
}
