import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';
import { MatSnackBarConfig, MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

const MAT_SNACK_BAR_OPTIONS: MatSnackBarConfig = {
  duration: 2500,
  horizontalPosition: 'end',
  verticalPosition: 'top'
}

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
  ],
  providers: [
    NotificationService,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: MAT_SNACK_BAR_OPTIONS
    }
  ]
})
export class NotificationModule { }
