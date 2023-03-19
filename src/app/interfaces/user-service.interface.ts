import { User } from '@models/user.model';
import { Observable } from 'rxjs';

export interface UserServiceInterface {
    findAllUsers(): Observable<User[]>;
    findUserById(id: number): Observable<User>;
}