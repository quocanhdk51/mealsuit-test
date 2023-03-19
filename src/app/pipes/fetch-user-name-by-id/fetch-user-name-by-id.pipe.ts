import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { NotificationService } from '@services/notification/notification.service';
import { UsersStore } from '@component-stores/users.store';

@Pipe({
  name: 'fetchUserNameById'
})
export class FetchUserNameByIdPipe implements PipeTransform {

  constructor(
    private readonly _usersStore: UsersStore,
    private readonly _notificationService: NotificationService,
  ) {}

  transform(id: number): Observable<string> {
    return this._usersStore.getUser(id).pipe(
      map(user => user.name),
      catchError((error: Error) => {
        this._notificationService.displayMessage(error.message);
        return of('N/A');
      })
    );
  }

}
