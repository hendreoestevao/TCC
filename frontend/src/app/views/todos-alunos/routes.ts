import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Icons'
    },
    children: [
      {
        path: '',
        redirectTo: 'todos',
        pathMatch: 'full'
      },
      {
        path: 'todos',
        loadComponent: () => import('./todos-alunos.component').then(m => m.TodosAlunosComponent),
        data: {
          title: 'todos'
        }
      },

    ]
  }
];
