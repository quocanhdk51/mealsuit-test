import { MatMenuModule } from '@angular/material/menu';
import { PreventClickFallbackModule } from '@directives/prevent-click-fallback/prevent-click-fallback.module';
import { RouterModule } from '@angular/router';
import { UserAvatarModule } from './../user-avatar/user-avatar.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListItemComponent } from './task-list-item.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskStatusModule } from '../task-status/task-status.module';

@NgModule({
  declarations: [
    TaskListItemComponent
  ],
  imports: [
    CommonModule,
    UserAvatarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    PreventClickFallbackModule,
    TaskStatusModule,
    MatMenuModule
  ],
  exports: [
    TaskListItemComponent,
  ]
})
export class TaskListItemModule { }
