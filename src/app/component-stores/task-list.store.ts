import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { Task, TaskFilter } from '@models/task.model';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, switchMap, tap } from 'rxjs/operators';
import { TaskServiceInterface } from '@interfaces/task-service.interface';
import { TASK_SERVICE_TOKEN } from '@tokens/task.token';
import { LoaderService } from '@components/loader/loader.service';
import { NotificationService } from '@services/notification/notification.service';
import { TaskInputDialogService } from '@components/task-input-dialog/task-input-dialog.service';
import { isValidFiltered } from '@utils/task.util';

export interface TaskListState {
    tasks: Task[];
    filter: TaskFilter;
};

export const INITIAL_TASK_LIST_STATE: TaskListState = {
    tasks: [],
    filter: {
        title: '',
        assigneeId: null,
        completed: null
    }
}

@Injectable()
export class TaskListStore extends ComponentStore<TaskListState> {
    constructor(
        @Inject(TASK_SERVICE_TOKEN) private readonly _taskService: TaskServiceInterface,
        private readonly _loaderService: LoaderService,
        private readonly _notificationService: NotificationService,
        private readonly _taskInputDialogService: TaskInputDialogService
    ) {
        super(INITIAL_TASK_LIST_STATE);
        this._getTasks();
    }

    public readonly tasks$: Observable<Task[]> = this.select(state => {
        const filterTasks = state.tasks.filter(task => isValidFiltered(task, state.filter));

        return filterTasks;
    });

    public readonly filterTask = this.updater((state, filter: TaskFilter) => ({
        tasks: state.tasks, filter
    }));

    public readonly openTaskCreateDialog = this.effect($ => $.pipe(
        exhaustMap(() => this._taskInputDialogService.createTask()),
        tap((task: Task) => {
            if (!!task) {
                this.addTask(task);
            }
        })
    ));

    public readonly addTask = this.updater((state, task: Task) => ({
        tasks: [...state.tasks, task], filter: state.filter
    }));

    public readonly completeTask = this.effect((task$: Observable<Task>) => task$.pipe(
        switchMap((task) => this._loaderService.wrapObservable(this._taskService.complete(task))),
        tapResponse(
            (task: Task) => this.updateTask(task),
            (error: Error) => this._notificationService.displayMessage(error.message)
        )
    ));

    public readonly openTaskUpdateDialog = this.effect((task$: Observable<Task>) => task$.pipe(
        switchMap((task) => this._taskInputDialogService.updateTask(task)),
        tap((task: Task) => {
            if (!!task) {
                this.updateTask(task);
            }
        })
    ));

    public readonly updateTask = this.updater((state, updateTask: Task) => {
        const tasks = state.tasks;
        const updatingTaskIndex = tasks.findIndex(task => task.id === updateTask.id);

        if (updatingTaskIndex > -1) {
            tasks[updatingTaskIndex] = updateTask;
            return { tasks: [...tasks], filter: state.filter };
        } else {
            return { tasks, filter: state.filter };
        }
    });

    private readonly _getTasks = this.effect($ => $.pipe(
        exhaustMap(() => this._loaderService.wrapObservable(this._taskService.findAllTasks())),
        tapResponse(
            (tasks: Task[]) => this.patchState({ tasks }),
            (error: Error) => this._notificationService.displayMessage(error.message)
        )
    ));
}