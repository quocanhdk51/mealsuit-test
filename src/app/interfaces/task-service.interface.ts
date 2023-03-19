import { Observable } from "rxjs";
import { TaskCreateDTO, TaskUpdateDTO, Task } from "@models/task.model";

export interface TaskServiceInterface {
    findAllTasks(): Observable<Task[]>;
    findTaskById(id: number): Observable<Task>;
    createTask(data: TaskCreateDTO): Observable<Task>;
    updateTask(taskId: number, data: TaskUpdateDTO): Observable<Task>;
    complete(task: Task): Observable<Task>;
    assign(taskId: number, userId: number): Observable<Task>;
}