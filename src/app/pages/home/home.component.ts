import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, State } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  State = State;

  id = signal(0);

  title = 'My Day';
  subtitle = 'All my taks in one place!';

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
    //Guarda los cambios en Local Storage
    effect(()=>{
      const tasks = this.tasks();
      const id = this.id();
      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('id', JSON.stringify(id));
    });
  }

  //Retorna los datos guardados del Local Storage una vez que la pagina cargue
  ngOnInit(){
    const storageTasks = localStorage.getItem('tasks');
    const storageId = localStorage.getItem('id');
    if(storageTasks){
      const tasks = JSON.parse(storageTasks);
      this.tasks.set(tasks);
    }
    if(storageId){
      const id = JSON.parse(storageId);
      this.id.set(id);
    }
  }

  //Busqueda de tareas
  searchTask(taskName: string){
    this.wordSearch.set(taskName.trim());
  };
  //Creacion de tareas
  createTaskByClick(event: Event){
  };
  createTaskByEnter(event: Event){
    const elementInput = event.target as HTMLInputElement;
    const value = elementInput.value.trim();
    if(value != ''){
      const title = value;
      this.createTask(title);
    };
    this.clearInputAdd(elementInput);
  };
  createTask(title: string){
    this.id.set(this.id()+1);
    const newTask: Task = {
      id: Number(this.id()),
      title: title,
      state: State.pending,
      isEdited: false
    };
    this.tasks.update(tasks=>[...tasks, newTask]);
  };
  //Actualizacion de tareas
  updateTask(event: Event, id: Number){
    const elementInput = event.target as HTMLInputElement;
    this.tasks.update(tasks => tasks.map(
      (item) =>
      item.id === id?
        {...item, title: elementInput.value, isEdited: false}
        : item
    ));
  };

  restoreTask(event: Event, id: Number){
    const elementInput = event.target as HTMLInputElement;
    this.tasks.update(tasks => tasks.map(
      (item) =>
      item.id === id && item.title != elementInput.value?
        {...item, title: item.title}
        : { ...item, isEdited: false }
    ));
  };
  
  //Eliminacion de tareas
  clearAllTaskCompleted(){
    this.tasks.update(tasks=>tasks.filter((item)=> item.state!==State.completing));
  };
  deleteTask(id: Number){
    this.tasks.update(tasks=>tasks.filter((item)=>item.id!=id));
  };

  //Cambio de estado de tarea
  changeStateTask(id:Number, event: Event){
    const elementInput = event.target as HTMLInputElement;
    this.tasks.update(tasks=>tasks.map(
      (item, pos)=> {
        if(item.id===id){
          //state:true -> estado completado
          //state:false -> estado pendiente
          return elementInput.checked ?
          { ...item, state: State.completing}:
          { ...item, state: State.pending};
        }
        return item
      }
    ));
  };

  //Adicionales auxiliares
  clearInputAdd(search: HTMLInputElement){
    search.value = '';
  };
  clearInputSearch(){
    this.searchCtrl.setValue('');
  };
  changeStateFilter(state: State){
    this.filter.update(()=>state);
  };
  totalCompletedTasks<Number>(){
    return this.tasksFilter().filter(task => task.state == State.completing).length;
  }
}
