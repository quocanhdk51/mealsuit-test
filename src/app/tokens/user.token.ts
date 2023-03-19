import { InjectionToken } from "@angular/core";
import { UserServiceInterface } from "@interfaces/user-service.interface";

export const USER_SERVICE_TOKEN = new InjectionToken<UserServiceInterface>('USER_SERVICE_TOKEN');
