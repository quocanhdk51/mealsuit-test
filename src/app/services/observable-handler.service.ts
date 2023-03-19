import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoaderService } from '@components/loader/loader.service';
import { NotificationService } from './notification/notification.service';

@Injectable()
export class ObservableHandlerService {

  constructor(
    private readonly _notificationService: NotificationService,
    private readonly _loaderService: LoaderService,
  ) { }

  public wrapObservable<T>(observable: Observable<T>): Observable<T> {
    return this._loaderService.wrapObservable(
      observable.pipe(
        catchError((error: Error) => {
          this._notificationService.displayMessage(error.message);
          return throwError(error);
        })
      )
    );
  } 
}
