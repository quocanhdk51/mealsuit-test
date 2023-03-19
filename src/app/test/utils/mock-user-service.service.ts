import { UserServiceInterface } from '@interfaces/user-service.interface';
import { User } from '@models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export const USER_NOT_FOUND_ERROR_MESSAGE = 'User not found';

export const MOCK_USERS: User[] = [
    {
        id: 0,
        name: 'user name 1'
    },
    {
        id: 1,
        name: 'user name 2'
    }
];

export class MockUserService implements UserServiceInterface {
    private _users$: BehaviorSubject<User[]> = new BehaviorSubject(MOCK_USERS);

    findAllUsers(): Observable<User[]> {
        return this._users$.asObservable();
    }

    findUserById(id: number): Observable<User> {
        return this.findAllUsers().pipe(
            map((users) => this._getUserById(users, id))
        );
    }

    private _getUserById(users: User[], id: number): User {
        const foundUser = users.find(user => user.id === id);

        if (!foundUser) {
            throw new Error(USER_NOT_FOUND_ERROR_MESSAGE);
        }

        return foundUser;
    }
}
