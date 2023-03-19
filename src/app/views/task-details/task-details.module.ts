import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserAvatarModule } from '@components/user-avatar/user-avatar.module';
import { TaskStatusModule } from '@components/task-status/task-status.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDetailsComponent } from './task-details.component';
import { TaskDetailsRoutingModule } from './task-details-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { TaskInputDialogModule } from '@components/task-input-dialog/task-input-dialog.module';


@NgModule({
  declarations: [
    TaskDetailsComponent
  ],
  imports: [
    CommonModule,
    TaskStatusModule,
    UserAvatarModule,
    MatButtonModule,
    MatIconModule,
    TaskDetailsRoutingModule,
    MatMenuModule,
    TaskInputDialogModule
  ],
  exports: [TaskDetailsRoutingModule]
})
export class TaskDetailsModule { }
