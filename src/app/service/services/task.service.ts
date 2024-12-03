import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {Task} from "../models/task.entity";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, retry} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseService<Task> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/tasks';
  }

  getAllByUserId(userId: number) : Observable<Task[]>{
    return this.http.get<Task[]>(`${this.resourcePath()}?userId=${userId}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
