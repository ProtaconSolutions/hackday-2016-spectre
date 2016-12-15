export interface Note {
  text: string,
  parentNote: string,
  team: string,
  user: string,
  createdAt: number,
  updatedAt: number,
  childnotes: string[],
  tags: string[]
}
