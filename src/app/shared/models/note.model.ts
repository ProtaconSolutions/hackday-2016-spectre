export class Note {
  $key: string;
  createdAt: number;
  parentNote: Note;
  retro: string;
  tags: Array<string>;
  team: string;
  text: string;
  updatedAt: number;
  user: string;
}
