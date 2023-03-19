import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class NotificationService {

  constructor(private readonly _snackBar: MatSnackBar) {}

  public displayMessage(message: string): void {
    this._snackBar.open(message, 'Close');
  }
}
