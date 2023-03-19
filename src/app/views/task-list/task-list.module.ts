import { TaskInputDialogModule } from '@components/task-input-dialog/task-input-dialog.module';
import { TaskListItemModule } from '@components/task-list-item/task-list-item.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list.component';
import { TaskListRoutingModule } from './task-list-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { TaskListFilterModule } from '@components/task-list-filter/task-list-filter.module';


@NgModule({
  declarations: [
    TaskListComponent
  ],
  imports: [
    CommonModule,
    TaskListRoutingModule,
    TaskListItemModule,
    MatButtonModule,
    TaskInputDialogModule,
    TaskListFilterModule,
  ]
})
export class TaskListModule { }
