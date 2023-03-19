import { DialogMode } from "./dialog.model";

export interface Task {
    id: number;
    title: string;
    description: string;
    assigneeId: number;
    completed: boolean;
}

export interface TaskCreateDTO {
    title: string;
    description: string;
}

export type TaskUpdateDTO = Partial<Omit<Task, "id">>;

export type TaskFilter = Partial<Pick<Task, 'title' | 'completed' | 'assigneeId'>>;

export type TaskResultDialogData = Task | null;

export type TaskDialogData = {
    mode: DialogMode,
    task?: Task
};

export type TaskForm = Pick<Task, 'title' | 'description' | 'assigneeId'>;

