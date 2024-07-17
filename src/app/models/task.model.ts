export enum State {
  pending = 'pending',
  completing = 'completing',
  all = 'all',
  founded = 'founded'
}

export interface Task {
  id: number;
  title: string;
  state: State;
  isEdited: boolean
}
