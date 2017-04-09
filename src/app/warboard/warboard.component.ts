import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { NotesService, TeamService } from '../shared/services/';
import { Note, Team } from 'app/shared/models';

@Component({
  selector: 'app-warboard',
  templateUrl: './warboard.component.html',
  styleUrls: ['./warboard.component.scss']
})

export class WarboardComponent implements OnInit {
  public actionPoints$: Observable<Array<Note>>;
  public decisions$: Observable<Array<Note>>;

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
    this.teamService.team$.subscribe((team: Team) => {
      if (!team) {
        this.actionPoints$ = Observable.of([]);
        this.decisions$ = Observable.of([]);

        return;
      }

      // And when we have note types resolved fetch action points and decisions for team
      this.notesService.noteTypes$.subscribe(() => {
        this.actionPoints$ = this.notesService.getNoteTypes(team.$key, 'ActionPoint');
        this.decisions$ = this.notesService.getNoteTypes(team.$key, 'Decision');
      });
    });
  }
}
