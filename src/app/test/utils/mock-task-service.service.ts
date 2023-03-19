import { TaskServiceInterface } from "@interfaces/task-service.interface";
import { Task, TaskCreateDTO, TaskUpdateDTO } from "@models/task.model";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { map } from 'rxjs/operators';

export const TASK_NOT_FOUND_ERROR_MESSAGE = 'Task not found';

export const MOCK_TASKS: Task[] = [
    {
        id: 0,
        title: 'task title 1',
        description: 'task description 1',
        assigneeId: 0,
        completed: false,
    },
    {
        id: 1,
        title: 'task title 2',
        description: 'task description 2',
        assigneeId: 1,
        completed: false,
    }
];

export class MockTaskService implements TaskServiceInterface {
    private _tasks$: BehaviorSubject<Task[]> = new BehaviorSubject(MOCK_TASKS);

    findAllTasks(): Observable<Task[]> {
        return this._tasks$.asObservable();
    }

    findTaskById(id: number): Observable<Task> {
        return this.findAllTasks().pipe(
            map((tasks) => this._getTaskById(tasks, id))
        );
    }

    createTask(data: TaskCreateDTO): Observable<Task> {
        const newId = this._getLatestId() + 1;
        const newTask: Task = {
            id: newId,
            title: data.title,
            description: data.description,
            assigneeId: null,
            completed: false
        };

        this._tasks$.next([...this._tasks$.value, newTask]);
        return this.findTaskById(newId);
    }

    updateTask(taskId: number, data: TaskUpdateDTO): Observable<Task> {
        let currentTasks: Task[] = this._tasks$.value;

        try {
            const updateTask = this._getTaskById(currentTasks, taskId);
            const updatedTask = {
                ...updateTask,
                ...data,
            };

            currentTasks = currentTasks.map(task => task.id === taskId ? updatedTask : task);
            this._tasks$.next(currentTasks);
            
            return this.findTaskById(taskId);
        } catch (error) {
            return throwError(error);
        }
    }

    complete(task: Task): Observable<Task> {
        return this.updateTask(task.id, { completed: true });
    }

    assign(taskId: number, userId: number): Observable<Task> {
        return this.updateTask(taskId, { assigneeId: userId });
    }

    private _getLatestId(): number {
        const ids = this._tasks$.value.map(task => task.id);
        return Math.max(...ids);
    }

    private _getTaskById(tasks: Task[], id: number): Task {
        const foundTask = tasks.find(task => task.id === id);

        if (!foundTask) {
            throw new Error(TASK_NOT_FOUND_ERROR_MESSAGE);
        }

        return foundTask;
    }
}
