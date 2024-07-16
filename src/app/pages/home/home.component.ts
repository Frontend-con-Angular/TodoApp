import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'My Day';
  subtitle = 'All my taks in one place!';

  inputSearch = 'Buscar una tarea';
  inputAddTask = 'Agregar una tarea';

  states = ['pending', 'completed'];
  stateChangedTask = ['noPressed', 'pressed'];

  tasks = signal([
    ['Learn Javascript', this.states[0], this.stateChangedTask[0]],
    ['Buy a unicorn', this.states[1], this.stateChangedTask[0]],
    ['Teach english', this.states[1], this.stateChangedTask[0]],
    ['Swim tomorrow', this.states[0], this.stateChangedTask[0]],
  ]);
  searchTask(event: Event){
    const inputElement = event.target as HTMLInputElement;

  };
  createTaskByClick(event: Event){
  };
  createTaskByEnter(event: Event){
    const elementInput = event.target as HTMLInputElement;
    if(elementInput.value != ''){
      const newTask = [elementInput.value, this.states[0]];
      this.tasks.update(tasks=>[...tasks, newTask])
    }
  };
  updateTask(event: Event, position: Number){
    const elementInput = event.target as HTMLInputElement;
    this.tasks.update(tasks=>tasks.map(
      (item, pos)=>
        pos===position?
          [elementInput.value, item[1], this.stateChangedTask[1]] : item));
  };
  restoreTask(event: Event, position: Number){
    const elementInput = event.target as HTMLInputElement;
    this.tasks.update(tasks=>tasks.map(
      (item, pos)=>
        pos===position && item[0]!=elementInput.value?
          [item[0], item[1], this.stateChangedTask[0]] : item));
  };
  clearAllTaskCompleted(){
    this.tasks.update(tasks=>tasks.filter((item)=> item[1]!=='completed'));
  };
  deleteTask(position: Number){
    this.tasks.update(tasks=>tasks.filter((item, pos)=>pos!==position));
  };
  changeStateTask(position:Number, state: Boolean){
    this.tasks.update(tasks=>tasks.map(
      (item, pos)=> {
        if(pos===position){
          //state:true -> estado completado
          //state:false -> estado pendiente
          return state? [item[0], this.states[1], this.stateChangedTask[0]] : [item[0], this.states[0], this.stateChangedTask[0]];
        }
        return item
      }
    ));
  };
}
