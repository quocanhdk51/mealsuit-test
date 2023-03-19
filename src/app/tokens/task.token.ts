import { TaskServiceInterface } from '@interfaces/task-service.interface';
import { InjectionToken } from '@angular/core';

export const TASK_SERVICE_TOKEN = new InjectionToken<TaskServiceInterface>('TASK_SERVICE_TOKEN');
