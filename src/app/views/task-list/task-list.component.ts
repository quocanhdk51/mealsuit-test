import { Observable } from 'rxjs';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Task, TaskFilter } from '@models/task.model';
import { TaskListStore } from '@component-stores/task-list.store';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskListStore]
})
export class TaskListComponent {
  public readonly tasks$: Observable<Task[]> = this._store.tasks$;

  constructor(
    private readonly _store: TaskListStore,
  ) { }

  public onNewTask(): void {
    this._store.openTaskCreateDialog();
  }

  public onFilterTask(filter: TaskFilter): void {
    this._store.filterTask(filter);
  }
}
