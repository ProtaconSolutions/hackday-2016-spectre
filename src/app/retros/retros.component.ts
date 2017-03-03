import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalStorageService } from 'ng2-webstorage';

@Component({
  selector: 'app-retros',
  templateUrl: './retros.component.html',
  styleUrls: ['./retros.component.scss']
})
export class RetrosComponent implements OnInit {
  public retros: FirebaseListObservable<any[]>;
  public team: any;

  public madNotes: any;
  public sadNotes: any;
  public gladNotes: any;

  public madId: string;
  public sadId: string;
  public gladId: string;

  constructor(
    private angularFire: AngularFire,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit() {
    this.team = this.localStorage.retrieve('team');
    this.retros = this.angularFire.database.list('/retros/'+this.team.$key);
    this.getRetroNotes(this.team.$key);

    this.localStorage
      .observe('team')
      .subscribe((value) => {
        this.team = value;
        this.retros = this.angularFire.database.list('/retros/'+this.team.$key);

        this.getRetroNotes(this.team.$key);
      });
  }

  /**
   * Gets retrospective notes for the given team.
   * @param teamKey Team identifier
   */
  private getRetroNotes(teamKey){

    let tags = this.angularFire.database.list('tags', {
      query: {
        orderByChild: 'type',
        equalTo: 'MadSadGlad',
      }
    });

    let teamNotes = this.angularFire.database.list('/notes/' + teamKey);

    // Get mad notes
    tags.map(types => types.filter(item => item.hasOwnProperty('name') && item.name === 'Mad'))
      .subscribe(value => {
        this.madId = value[0].$key;

        teamNotes.map(notes => notes.filter(note => note.hasOwnProperty('tags') && note.tags.includes(this.madId)))
          .subscribe(filteredNotes => {
            this.madNotes = filteredNotes;
          });
      });

    // Get sad notes
    tags.map(types => types.filter(item => item.hasOwnProperty('name') && item.name === 'Sad'))
      .subscribe(value => {
        this.sadId = value[0].$key;

        teamNotes.map(notes => notes.filter(note => note.hasOwnProperty('tags') && note.tags.includes(this.sadId)))
          .subscribe(filteredNotes => {
            this.sadNotes = filteredNotes;
          });
      });

    // Get glad notes
    tags.map(types => types.filter(item => item.hasOwnProperty('name') && item.name === 'Glad'))
      .subscribe(value => {
        this.gladId = value[0].$key;

        teamNotes.map(notes => notes.filter(note => note.hasOwnProperty('tags') && note.tags.includes(this.gladId)))
          .subscribe(filteredNotes => {
            this.gladNotes = filteredNotes;
          });
      });
  }
}
