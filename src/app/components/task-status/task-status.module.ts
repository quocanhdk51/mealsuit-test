import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatusComponent } from './task-status.component';



@NgModule({
  declarations: [TaskStatusComponent],
  imports: [
    CommonModule
  ],
  exports: [TaskStatusComponent]
})
export class TaskStatusModule { }