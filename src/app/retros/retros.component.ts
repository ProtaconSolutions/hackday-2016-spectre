import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { NotesService, TeamService } from '../shared/services/';
import { Note, Retro } from '../shared/models/';

@Component({
  selector: 'app-retros',
  templateUrl: './retros.component.html',
  styleUrls: ['./retros.component.scss']
})

export class RetrosComponent implements OnInit {
  public retros$: FirebaseListObservable<Array<Retro>>;

  public madNotes: Array<Note> = [];
  public sadNotes: Array<Note> = [];
  public gladNotes: Array<Note> = [];

  private teamKey: string;

  /**
   * Constructor of the class
   *
   * @param {AngularFire}   angularFire
   * @param {TeamService}   teamService
   * @param {NotesService}  notesService
   */
  constructor(
    private angularFire: AngularFire,
    private teamService: TeamService,
    private notesService: NotesService
  ) { }

  /**
   * On init lifecycle hook, in here we want to do following:
   *  1) subscribe to team changes
   *  2) when ever team changes we want to
   *    2.1) Fetch team retros
   *    2.2) Fetch team notes
   */
  ngOnInit() {
    this.teamService.team$.subscribe(team => {
      this.teamKey = team.$key;

      this.retros$ = this.angularFire.database.list(`/retros/${this.teamKey}`);

      // And when we have tags resolved fetch notes for team
      this.notesService.tags$.subscribe(() => {
        this.fetchTeamNotes();
      });
    });
  }

  /**
   * Getter method for retro notes count. Basically just sum 'Mad', 'Sad' and 'Glad' notes for specified Retro.
   *
   * @param {Retro} retro
   * @returns {number}
   */
  public getRetroNotesCount(retro: Retro): number {
    return [this.madNotes, this.sadNotes, this.gladNotes]
      .map(notes => notes.filter(note => note.retro === retro.$key).length)
      .reduce((acc, val) => acc + val);
  }

  /**
   * Getter method for team notes for specified type.
   *
   * TODO: use enums
   *
   * @param {string}  type
   * @param {Retro}   retro
   * @returns {Array}
   */
  public getNotes(type: string, retro: Retro) {
    let initData;

    switch (type) {
      case 'Mad':
        initData = this.madNotes;
        break;
      case 'Sad':
        initData = this.sadNotes;
        break;
      case 'Glad':
        initData = this.gladNotes;
        break;
    }

    return initData ? initData.filter(item => item.retro === retro.$key) : [];
  }

  /**
   * Gets retrospective notes for the given team.
   *
   * TODO: use enums + foreach / map
   */
  private fetchTeamNotes() {
    this.notesService
      .getNotes(this.teamKey, 'Mad')
      .subscribe(notes => {
        this.madNotes = notes;
      });

    this.notesService
      .getNotes(this.teamKey, 'Sad')
      .subscribe(notes => {
        this.sadNotes = notes;
      });

    this.notesService
      .getNotes(this.teamKey, 'Glad')
      .subscribe(notes => {
        this.gladNotes = notes;
      });
  }
}
