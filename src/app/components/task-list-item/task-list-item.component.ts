import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Task } from '@models/task.model';
import { TaskListStore } from '@component-stores/task-list.store';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListItemComponent {
  @Input() task: Task;

  constructor(
    private readonly _store: TaskListStore,
  ) { }

  public onUpdateTask(): void {
    this._store.openTaskUpdateDialog(this.task);
  }

  public onCompleteTask(): void {
    this._store.completeTask(this.task);
  }
}
