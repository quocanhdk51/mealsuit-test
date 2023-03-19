import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Inject, Pipe, PipeTransform } from '@angular/core';
import { NotificationService } from '@services/notification/notification.service';
import { UserServiceInterface } from '@interfaces/user-service.interface';
import { USER_SERVICE_TOKEN } from '@tokens/user.token';

@Pipe({
  name: 'fetchUserNameById'
})
export class FetchUserNameByIdPipe implements PipeTransform {

  constructor(
    @Inject(USER_SERVICE_TOKEN) private readonly _userService: UserServiceInterface,
    private readonly _notificationService: NotificationService,
  ) {}

  transform(id: number): Observable<string> {
    return this._userService.findUserById(id).pipe(
      map(user => user.name),
      catchError((error: Error) => {
        this._notificationService.displayMessage(error.message);
        return of('N/A');
      })
    );
  }

}
