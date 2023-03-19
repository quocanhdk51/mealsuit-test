import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: 'tasks',
        loadChildren: () => import('./views/task-list/task-list.module').then(m => m.TaskListModule)
    },
    {
        path: 'task-details/:id',
        loadChildren: () => import('./views/task-details/task-details.module').then(m => m.TaskDetailsModule)
    },
    {
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/tasks',
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}