import { TaskInputDialogComponent } from './task-input-dialog.component';
import { TaskResultDialogData, TaskDialogData, Task } from '@models/task.model';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { DialogMode } from '@models/dialog.model';

@Injectable()
export class TaskInputDialogService {

  constructor(
    private readonly _dialog: MatDialog,
  ) { }

  public createTask(): Observable<TaskResultDialogData> {
    return this._dialog.open<TaskInputDialogComponent, TaskDialogData, TaskResultDialogData>(
      TaskInputDialogComponent,
      {
        minWidth: '400px',
        data: {
          mode: DialogMode.CREATE
        }
      }
    ).afterClosed();
  }

  public updateTask(task: Task): Observable<TaskResultDialogData> {
    return this._dialog.open<TaskInputDialogComponent, TaskDialogData, TaskResultDialogData>(
      TaskInputDialogComponent,
      {
        minWidth: '400px',
        data: {
          mode: DialogMode.UPDATE,
          task: task
        }
      }
    ).afterClosed();
  }
}
