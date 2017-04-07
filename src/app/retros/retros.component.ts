import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { TeamService } from '../shared/services/';

@Component({
  selector: 'app-retros',
  templateUrl: './retros.component.html',
  styleUrls: ['./retros.component.scss']
})
export class RetrosComponent implements OnInit {
  public retros: FirebaseListObservable<any[]>;

  public madNotes: any;
  public sadNotes: any;
  public gladNotes: any;

  public madId: string;
  public sadId: string;
  public gladId: string;

  private team: any;
  private teamKey: string;

  constructor(
    private angularFire: AngularFire,
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.teamService.team$.subscribe(team => {
      this.team = team;
      this.teamKey = team.$key;

      this.retros = this.angularFire.database.list(`/retros/${this.teamKey}`);
      this.getRetroNotes();
    });
  }

  /**
   * Gets retrospective notes for the given team.
   */
  private getRetroNotes() {
    let tags = this.angularFire.database.list('tags', {
      query: {
        orderByChild: 'type',
        equalTo: 'MadSadGlad',
      }
    });

    let teamNotes = this.angularFire.database.list(`/notes/${this.teamKey}`);

    // Get mad notes
    tags.map(types => types.filter(item => item.hasOwnProperty('name') && item.name === 'Mad'))
      .subscribe(value => {
        this.madId = (value[0] && value[0].hasOwnProperty('$key')) ? value[0].$key : null;

        if (this.madId) {
          teamNotes.map(notes => notes.filter(note => note.hasOwnProperty('tags') && note.tags.includes(this.madId)))
            .subscribe(filteredNotes => {
              this.madNotes = filteredNotes;
            });
        }
      });

    // Get sad notes
    tags.map(types => types.filter(item => item.hasOwnProperty('name') && item.name === 'Sad'))
      .subscribe(value => {
        this.sadId = (value[0] && value[0].hasOwnProperty('$key')) ? value[0].$key : null;

        if (this.sadId) {
          teamNotes.map(notes => notes.filter(note => note.hasOwnProperty('tags') && note.tags.includes(this.sadId)))
            .subscribe(filteredNotes => {
              this.sadNotes = filteredNotes;
            });
        }
      });

    // Get glad notes
    tags.map(types => types.filter(item => item.hasOwnProperty('name') && item.name === 'Glad'))
      .subscribe(value => {
        this.gladId = (value[0] && value[0].hasOwnProperty('$key')) ? value[0].$key : null;

        if (this.gladId) {
          teamNotes.map(notes => notes.filter(note => note.hasOwnProperty('tags') && note.tags.includes(this.gladId)))
            .subscribe(filteredNotes => {
              this.gladNotes = filteredNotes;
            });
        }
      });
  }
}
