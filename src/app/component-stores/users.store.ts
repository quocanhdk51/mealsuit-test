import { tapResponse } from '@ngrx/component-store';
import { USER_SERVICE_TOKEN } from '@tokens/user.token';
import { map, exhaustMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { Inject, Injectable } from '@angular/core';
import { User } from '@models/user.model';
import { UserServiceInterface } from '@interfaces/user-service.interface';
import { NotificationService } from '@services/notification/notification.service';

export interface UsersState {
    users: User[];
    initialLoaded: boolean;
}

export const INITIAL_USERS_STATE: UsersState = {
    users: [],
    initialLoaded: false,
};

const USER_NAME_PLACE_HOLDER: string = 'N/A';

@Injectable()
export class UsersStore extends ComponentStore<UsersState> {
    constructor(
        @Inject(USER_SERVICE_TOKEN) private readonly _userService: UserServiceInterface,
        private readonly _notificationService: NotificationService,
    ) {
        super(INITIAL_USERS_STATE);
        this._fetchUsers();
    }

    public readonly users$: Observable<User[]> = this.select(state => state.users);

    public readonly getUser = (userId: number): Observable<User> => this.users$.pipe(
        map((users) => {
            const foundUser = users.find(user => user.id === userId);

            if (!!foundUser) {
                return foundUser;
            } else if (!this.get().initialLoaded) {
                return { id: userId, name: USER_NAME_PLACE_HOLDER };
            } else {
                throw new Error('User not found');
            }
        })
    );

    private readonly _fetchUsers = this.effect($ => $.pipe(
        exhaustMap(() => this._userService.findAllUsers()),
        tapResponse(
            (users: User[]) => this.setState({ users, initialLoaded: true }),
            (error: Error) => this._notificationService.displayMessage(error.message),
        )
    ));
}
