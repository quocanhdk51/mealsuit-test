import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskStatusComponent{
  @Input() completed: boolean;

  constructor() { }
}
