import { distinctUntilChanged, debounceTime, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { TaskFilter } from '@models/task.model';
import { INITIAL_TASK_LIST_STATE } from '@component-stores/task-list.store';
import { User } from '@models/user.model';
import { UsersStore } from '@component-stores/users.store';

const INITIAL_FILTER: TaskFilter = INITIAL_TASK_LIST_STATE.filter;

@Component({
  selector: 'app-task-list-filter',
  templateUrl: './task-list-filter.component.html',
  styleUrls: ['./task-list-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListFilterComponent implements OnInit, OnDestroy {
  @Output() onFilter: EventEmitter<TaskFilter> = new EventEmitter();

  public readonly users$: Observable<User[]> = this._userStore.users$;

  public readonly form: FormGroup = new FormGroup({
    title: new FormControl(INITIAL_FILTER.title),
    assigneeId: new FormControl(INITIAL_FILTER.assigneeId),
    completed: new FormControl(INITIAL_FILTER.completed)
  });

  private _destroy$: Subject<void> = new Subject();

  constructor(
    private readonly _userStore: UsersStore,
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
