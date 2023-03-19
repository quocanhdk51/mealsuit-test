import { Component } from '@angular/core';
import {BackendService} from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  tasks = this.backend.tasks();
  users = this.backend.users();

  constructor(private backend: BackendService) {}
}
