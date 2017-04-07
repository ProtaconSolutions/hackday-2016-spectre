import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { TeamService } from '../shared/services/';
import { NotesService } from '../shared/services/notes.service';

@Component({
  selector: 'app-retros',
  templateUrl: './retros.component.html',
  styleUrls: ['./retros.component.scss']
})
export class RetrosComponent implements OnInit {
  public retros: FirebaseListObservable<any[]>;

  public madNotes: Array<any> = [];
  public sadNotes: Array<any> = [];
  public gladNotes: Array<any> = [];

  private teamKey: string;

  constructor(
    private angularFire: AngularFire,
    private teamService: TeamService,
    private notesService: NotesService
  ) { }

  ngOnInit() {
    this.teamService.team$.subscribe(team => {
      this.teamKey = team.$key;

      this.retros = this.angularFire.database.list(`/retros/${this.teamKey}`);
    });

    // And when we have tags resolved fetch notes
    this.notesService.tags$.subscribe(() => {
      this.getRetroNotes();
    });
  }

  public getRetroNotesCount(retro): number {
    return [this.madNotes, this.sadNotes, this.gladNotes]
      .map(notes => notes.filter(note => note.retro === retro.$key).length)
      .reduce((acc, val) => acc + val);
  }

  public getNotes(type: string, retro) {
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
   */
  private getRetroNotes() {
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
