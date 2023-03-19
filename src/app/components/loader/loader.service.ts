import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class LoaderService {
  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  public enableLoading(): void {
    this._loading$.next(true);
  }

  public disableLoading(): void {
    this._loading$.next(false);
  }

  public wrapObservable<T>(observable: Observable<T>): Observable<T> {
    this.enableLoading();
    return observable.pipe(
      finalize(() => this.disableLoading())
    );
  }
}
