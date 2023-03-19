import { switchMap, map, tap, exhaustMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Injectable, Inject } from "@angular/core";
import { Task } from "@models/task.model";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { TASK_SERVICE_TOKEN } from '@tokens/task.token';
import { TaskServiceInterface } from '@interfaces/task-service.interface';
import { LoaderService } from '@components/loader/loader.service';
import { NotificationService } from '@services/notification/notification.service';
import { TaskInputDialogService } from '@components/task-input-dialog/task-input-dialog.service';

export interface TaskDetailsState {
    task: Task;
}

export const INITIAL_TASK_DETAILS_STATE: TaskDetailsState = {
    task: null,
};

export const UN_FOUND_TASK_PLACE_HOLDER: Task = {
    id: -1,
    title: 'No task found',
    description: 'The task ID does not exist in the system. Please go back to the task list',
    assigneeId: null,
    completed: false,
};

@Injectable()
export class TaskDetailsStore extends ComponentStore<TaskDetailsState> {
    constructor(
        @Inject(TASK_SERVICE_TOKEN) private readonly _taskService: TaskServiceInterface,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _loaderService: LoaderService,
        private readonly _notificationService: NotificationService,
        private readonly _taskInputDialogService: TaskInputDialogService,
    ) {
        super(INITIAL_TASK_DETAILS_STATE);

        const taskId$ = this._activatedRoute.params.pipe(
            map(params => params.id)
        );
        this._getTask(taskId$);
    }

    public readonly task$: Observable<Task> = this.select(state => state.task);

    public readonly completeTask = this.effect($ => $.pipe(
        exhaustMap(() => this._loaderService.wrapObservable(this._taskService.complete(this.get().task))),
        tapResponse(
            (task: Task) => this.updateTask(task),
            (error: Error) => this._notificationService.displayMessage(error.message),
        )
    ));

    public readonly openTaskUpdateDialog = this.effect($ => $.pipe(
        exhaustMap(() => this._taskInputDialogService.updateTask(this.get().task)),
        tap((task: Task) => {
            if (!!task) {
                this.updateTask(task);
            }
        })
    ));

    public readonly updateTask = this.updater((_state, task: Task) => ({ task }));

    private readonly _getTask = this.effect((id$: Observable<number>) => id$.pipe(
        switchMap(id => this._loaderService.wrapObservable(this._taskService.findTaskById(id))),
        tapResponse(
            (task: Task) => this.setState({ task }),
            (error: Error) => {
                this._notificationService.displayMessage(error.message);
                this.setState({ task: UN_FOUND_TASK_PLACE_HOLDER })
            },
        )
    ));
}