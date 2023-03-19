import { Task } from '@models/task.model';
import { Observable } from 'rxjs';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TaskDetailsStore } from '@component-stores/task-details.store';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskDetailsStore]
})
export class TaskDetailsComponent {
  public readonly task$: Observable<Task> = this._store.task$;

  constructor(
    private readonly _store: TaskDetailsStore,
  ) { }

  public updateTask(): void {
    this._store.openTaskUpdateDialog();
  }

  public completeTask(): void {
    this._store.completeTask();
  }
}
