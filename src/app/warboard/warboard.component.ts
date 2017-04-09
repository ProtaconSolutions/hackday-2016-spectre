import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { NotesService, TeamService } from '../shared/services/';
import { Note } from 'app/shared/models';

@Component({
  selector: 'app-warboard',
  templateUrl: './warboard.component.html',
  styleUrls: ['./warboard.component.scss']
})

export class WarboardComponent implements OnInit {
  public actionPoints$: Observable<Array<Note>>;
  public decisions$: Observable<Array<Note>>;

  private teamKey: string;

  /**
   * Constructor of the class
   *
   * @param {TeamService}   teamService
   * @param {NotesService}  notesService
   */
  public constructor(
    private teamService: TeamService,
    private notesService: NotesService,
  ) { }

  /**
   * On init life cycle hook method.
   */
  public ngOnInit(): void {
    this.teamService.team$.subscribe(team => {
      if (!team) {
        return;
      }

      this.teamKey = team.$key;

      // And when we have tags resolved fetch notes for team
      this.notesService.noteTypes$.subscribe(() => {
        this.actionPoints$ = this.notesService.getNoteTypes(this.teamKey, 'ActionPoint');
        this.decisions$ = this.notesService.getNoteTypes(this.teamKey, 'Decision');
      });
    });
  }
}
