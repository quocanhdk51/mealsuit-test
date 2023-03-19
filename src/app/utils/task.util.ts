import { TaskFilter, Task, TaskForm } from "@models/task.model";

export const isValidFiltered = (task: Task, filter: TaskFilter): boolean => {
    const filterKeys = Object.keys(filter);
    return filterKeys.every(
        (key) => {
            switch (key) {
                case 'title': return task.title.toLowerCase().includes(filter[key].toLowerCase());
                case 'assigneeId': return filter[key] == null || task.assigneeId === filter[key];
                case 'completed': return filter[key] == null || task.completed === filter[key];
                default: throw new Error('Unhandled filter key');
            }
        }
    );
};

export const trimTaskFormValue = (value: TaskForm): TaskForm => {
    Object.keys(value).forEach(key => {
      if (typeof value[key] === 'string') {
        value[key] = (value[key] as string).trim();
      }
    });

    return value;
};
