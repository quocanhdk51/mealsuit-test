import { LoaderModule } from '@components/loader/loader.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {BackendService} from './backend.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TASK_SERVICE_TOKEN } from '@tokens/task.token';
import { TaskService } from '@services/task.service';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from '@services/user.service';
import { NotificationModule } from '@services/notification/notification.module';
import { ObservableHandlerService } from '@services/observable-handler.service';
import { USER_SERVICE_TOKEN } from '@tokens/user.token';
import { UsersStore } from '@component-stores/users.store';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LoaderModule,
    NotificationModule
  ],
  providers: [
    BackendService,
    UserService,
    ObservableHandlerService,
    {
      // Why not just declare Task service? Why Injection Token instead?
      // Because I want to expand the capability to replace logic of the TaskService if needed.
      // TaskService is implemented with TaskServiceInterface so any Class of the same implementation
      // can be injected depending on the scope of the services
      provide: TASK_SERVICE_TOKEN,
      useClass: TaskService,
    },
    {
      provide: USER_SERVICE_TOKEN,
      useClass: UserService
    },
    UsersStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
