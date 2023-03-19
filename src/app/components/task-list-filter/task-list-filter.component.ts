import { catchError, distinctUntilChanged, debounceTime, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, OnDestroy, Inject } from '@angular/core';
import { TaskFilter } from '@models/task.model';
import { INITIAL_TASK_LIST_STATE } from '@component-stores/task-list.store';
import { User } from '@models/user.model';
import { NotificationService } from '@services/notification/notification.service';
import { USER_SERVICE_TOKEN } from '@tokens/user.token';
import { UserServiceInterface } from '@interfaces/user-service.interface';

const INITIAL_FILTER: TaskFilter = INITIAL_TASK_LIST_STATE.filter;

@Component({
  selector: 'app-task-list-filter',
  templateUrl: './task-list-filter.component.html',
  styleUrls: ['./task-list-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListFilterComponent implements OnInit, OnDestroy {
  @Output() onFilter: EventEmitter<TaskFilter> = new EventEmitter();

  public readonly users$: Observable<User[]> = this._userService.findAllUsers().pipe(
    catchError((error: Error) => {
      this._notificationService.displayMessage(error.message);
      return of([]);
    })
  );

  public readonly form: FormGroup = new FormGroup({
    title: new FormControl(INITIAL_FILTER.title),
    assigneeId: new FormControl(INITIAL_FILTER.assigneeId),
    completed: new FormControl(INITIAL_FILTER.completed)
  });

  private _destroy$: Subject<void> = new Subject();

  constructor(
    @Inject(USER_SERVICE_TOKEN) private readonly _userService: UserServiceInterface,
    private readonly _notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.form.valueChanges.pipe(
      takeUntil(this._destroy$),
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe((filter) => this.onFilter.emit(filter));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
