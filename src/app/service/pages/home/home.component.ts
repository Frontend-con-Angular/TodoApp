import {Component, computed, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, State } from '../../models/task.entity';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {AuthenticationService} from "../../../iam/services/authentication.service";
import {TaskService} from "../../services/task.service";
import {MatButton} from "@angular/material/button";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButton],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private authenticationService: AuthenticationService = inject(AuthenticationService);
  private taskService: TaskService = inject(TaskService);

  private userId = signal<number>(0);

  protected userName = signal<string>('');

  newTask  = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });

  State = State;

  id = signal(0);

  title = 'Bienvenido de nuevo! ';
  subtitle = 'Todo lo que necesitas hacer hoy';

  inputSearch = 'Buscar una tarea';
  inputAddTask = 'Agregar una tarea';

  filter = signal<State>(State.all);

  tasks = signal<Task[]>([]);

  wordSearch = signal<string>('');

  tasksFilter = computed(()=>{
    const filter = this.filter();
    const tasks = this.tasks();
    const wordSearch = this.wordSearch();

    if (filter == State.pending) {
        return tasks.filter(task => task.state == filter);
    }
    if (filter == State.completing) {
        return tasks.filter(task => task.state == filter);
    }
    if (wordSearch != '' && wordSearch.length > 2) {
      return tasks.filter(task =>task.title.includes(wordSearch));
    }
    return tasks;
  });

  // Formularios reactivos
  colorCtrl = new FormControl('rgb(72,168,189)');
  searchCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });

  constructor() {
    this.colorCtrl.valueChanges.subscribe(
      value => console.log(value)
    );
    this.searchCtrl.valueChanges.subscribe(
      value => this.searchTask(value.trim())
    );
  }

  ngOnInit(){
    this.getUserId();
    this.getUserName();
  }

  getUserId(){
    this.authenticationService.currentUserId.subscribe({
      next: (userId: number) => {
        this.userId.set(userId);
        this.getAllTasks();
      },
      error: (error: any) => console.error('Error getting userId:', error)
    })
    ;
  }

  getUserName(){
    this.authenticationService.currentUsername.subscribe({
      next: (userName: string) => {
        this.userName.set(userName);
      },
      error: (error: any) => console.error('Error getting userName:', error)
    });
  }

  getAllTasks(){
    if(this.userId() == 0) return;
    this.taskService.getAllByUserId(this.userId()).subscribe({
      next: (tasks: Task[]) => {
        this.tasks.set(tasks);
        console.log('Tasks:', tasks);
      },
      error: (error: any) => console.error('Error getting tasks:', error)
    });
  }

  searchTask(taskName: string){
    this.wordSearch.set(taskName.trim());
  };

  createTask(){
    if(this.newTask.invalid) return;
    const newTask: Task = new Task({title: this.newTask.value, userId: this.userId()});
    this.taskService.create(newTask).subscribe({
      next: () => {
        this.getAllTasks();
        this.newTask.setValue('');
      },
      error: (error: any) => console.error('Error creating task:', error)
    });
  };

  updateTask(id: Number, task: Task){
    this.taskService.update(id, task).subscribe({
      next: () => {
        this.getAllTasks();
      },
      error: (error: any) => console.error('Error updating task:', error)
    });
  }

  changeStateTask(id:Number, event: Event){
    const elementInput = event.target as HTMLInputElement;
    const taskToUpdate = this.tasks().find(task=>task.id===id);
    if(!taskToUpdate) return;
    const taskUpdated = new Task({...taskToUpdate, state: elementInput.checked?State.completing:State.pending});
    this.updateTask(id, taskUpdated);
  };

  updateTitleTask(event: Event, id: Number){
    const elementInput = event.target as HTMLInputElement;
    const taskToUpdate = this.tasks().find(task=>task.id===id);
    if(!taskToUpdate) return;
    const taskUpdated = new Task({...taskToUpdate, title: elementInput.value, isEdited: true});
    this.updateTask(id, taskUpdated);
  };

  restoreTask(event: Event, id: Number){
    const elementInput = event.target as HTMLInputElement;
    const taskToUpdate = this.tasks().find(task=>task.id===id);
    if(!taskToUpdate) return;
    const taskUpdated = new Task({...taskToUpdate, title: elementInput.value, isEdited: false});
    this.updateTask(id, taskUpdated);
  };

  clearAllTaskCompleted(){
    this.tasks().forEach(task => {
      if(task.state == State.completing){
        this.deleteTask(task.id);
      }
    });
  };

  deleteTask(id: Number){
    this.taskService.delete(id).subscribe({
      next: () => {
        this.getAllTasks();
      },
      error: (error: any) => console.error('Error deleting task:', error)
    });
  };


  clearInputSearch(){
    this.searchCtrl.setValue('');
  };
  changeStateFilter(state: State){
    this.filter.update(()=>state);
  };
  totalCompletedTasks(){
    return this.tasksFilter().filter(task => task.state == State.completing).length;
  }

  logout() {
    this.authenticationService.signOut();
  }
}
