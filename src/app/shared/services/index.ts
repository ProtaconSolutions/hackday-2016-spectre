import { TeamService } from './team.service';
import { NotesService } from './notes.service';

export * from './team.service';
export * from './notes.service';

export const Services = [
  TeamService,
  NotesService,
];
