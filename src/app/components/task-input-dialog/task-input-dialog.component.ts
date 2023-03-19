import { USER_SERVICE_TOKEN } from '@tokens/user.token';
import { Observable, combineLatest, of } from 'rxjs';
import { TaskDialogData, Task, TaskForm } from '@models/task.model';
import { TaskServiceInterface } from '@interfaces/task-service.interface';
import { TASK_SERVICE_TOKEN } from '@tokens/task.token';
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@models/user.model';
import { startWith, tap, map, switchMap, catchError } from 'rxjs/operators';
import { DialogMode } from '@models/dialog.model';
import { ObservableHandlerService } from '@services/observable-handler.service';
import { NotificationService } from '@services/notification/notification.service';
import { trimTaskFormValue } from '@utils/task.util';
import { UserServiceInterface } from '@interfaces/user-service.interface';

@Component({
  selector: 'app-task-input-dialog',
  templateUrl: './task-input-dialog.component.html',
  styleUrls: ['./task-input-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskInputDialogComponent {
  public readonly DIALOG_MODE = DialogMode;
  public readonly mode: DialogMode = this._dialogData.mode;

  private readonly _taskInitialFormState: TaskForm = {
    title: this._dialogData.task?.title || '',
    description: this._dialogData.task?.description || '',
    assigneeId: this._dialogData.task?.assigneeId || null
  };

  public readonly form: FormGroup = new FormGroup({
    title: new FormControl(this._taskInitialFormState.title || '', [Validators.required, Validators.minLength(8)]),
    description: new FormControl(this._taskInitialFormState.description || '', [Validators.required]),
    assigneeId: new FormControl(this._taskInitialFormState.assigneeId || null)
  });

  public readonly users$: Observable<User[]> = this._userService.findAllUsers().pipe(
    catchError((error: Error) => {
      this._notificationService.displayMessage(error.message);
      return of([]);
    })
  );

  private readonly _valueChanged$: Observable<boolean> = this.form.valueChanges.pipe(
    map((value) => {
      const currentFormState: TaskForm = {
        ...this.form.getRawValue(),
        ...value
      };

      return Object.keys(currentFormState).some((key) => {
        return this._taskInitialFormState[key] !== currentFormState[key];
      });
    })
  );

  private readonly _formValid$: Observable<boolean> = this.form.statusChanges.pipe(
    startWith(this.form.status),
    tap((status) => status === 'INVALID' && this.form.markAsDirty()),
    map((status) => status === 'VALID')
  );

  public readonly formSubmittable$: Observable<boolean> = combineLatest([this._valueChanged$, this._formValid$]).pipe(
    map(([valueChanged, formValid]) => valueChanged && formValid)
  );

  constructor(
    @Inject(TASK_SERVICE_TOKEN) private readonly _taskService: TaskServiceInterface,
    @Inject(USER_SERVICE_TOKEN) private readonly _userService: UserServiceInterface,
    @Inject(MAT_DIALOG_DATA) private readonly _dialogData: TaskDialogData,
    private readonly _dialogRef: MatDialogRef<TaskInputDialogComponent>,
    private readonly _observableHandler: ObservableHandlerService,
    private readonly _notificationService: NotificationService,
  ) { }

  public get formControls(): {
    [key: string]: AbstractControl;
  } {
    return this.form.controls;
  }

  public submit(): void {
    const handleSubmit = (): Observable<Task> => {
      const submittedValue: TaskForm = trimTaskFormValue(this.form.value);
    
      switch (this.mode) {
        case DialogMode.CREATE: {
          return this._handleCreateSubmit(submittedValue);
        }
        case DialogMode.UPDATE: {
          return this._handleUpdateSubmit(submittedValue);
        }
        default: throw new Error('Unhandled Dialog Mode');
      }
    };

    this._observableHandler.wrapObservable(handleSubmit()).subscribe(
      (value) => this._dialogRef.close(value),
    );
  }

  private _handleCreateSubmit(value: TaskForm): Observable<Task> {
    const { title, description, assigneeId } = value;
    const createTask = this._taskService.createTask({ title, description });

    if (!!assigneeId) {
      return createTask.pipe(
        switchMap((createdTask) => this._taskService.assign(createdTask.id, assigneeId))
      );
    } else {
      return createTask;
    }
  }

  private _handleUpdateSubmit(value: TaskForm): Observable<Task> {
    return this._taskService.updateTask(this._dialogData.task.id, value);
  }
}
