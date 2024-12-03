export enum State {
  pending = 'pending',
  completing = 'completing',
  all = 'all',
  founded = 'founded'
}

export class Task {
  id: number;
  title: string;
  state: State;
  isEdited: boolean;
  userId: number;

  constructor({
                id = 0,
                title = '',
                state = State.pending,
                isEdited = false,
                userId = 0,
              }={}) {
    this.id = id;
    this.title = title;
    this.state = state;
    this.isEdited = isEdited;
    this.userId = userId;
  }
}
