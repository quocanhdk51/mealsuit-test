import { BackendService } from '../backend.service';
import { Injectable } from '@angular/core';
import { TaskServiceInterface } from '@interfaces/task-service.interface';
import { Observable } from 'rxjs';
import { TaskCreateDTO, Task, TaskUpdateDTO } from '@models/task.model';

@Injectable()
export class TaskService implements TaskServiceInterface {

  constructor(
    private readonly _backendService: BackendService
  ) { }

  findAllTasks(): Observable<Task[]> {
    return this._backendService.tasks();
  }

  findTaskById(id: number): Observable<Task> {
    return this._backendService.task(id);
  }

  createTask(data: TaskCreateDTO): Observable<Task> {
    return this._backendService.newTask(data);
  }
  updateTask(taskId: number, data: TaskUpdateDTO): Observable<Task> {
    return this._backendService.update(taskId, data);
  }
  complete(task: Task): Observable<Task> {
    return this._backendService.complete(task.id, true);
  }
  assign(taskId: number, userId: number): Observable<Task> {
    return this._backendService.assign(taskId, userId);
  }
}
