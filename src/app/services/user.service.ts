import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { User } from '@models/user.model';
import { UserServiceInterface } from '@interfaces/user-service.interface';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(private readonly _backendService: BackendService) { }

  findAllUsers(): Observable<User[]> {
    return this._backendService.users();
  }

  findUserById(id: number): Observable<User> {
    return this._backendService.user(id);
  }
}
