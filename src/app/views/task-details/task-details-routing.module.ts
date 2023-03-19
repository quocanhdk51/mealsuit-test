import { TaskDetailsComponent } from './task-details.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core'; 
import { Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: TaskDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaskDetailsRoutingModule {}