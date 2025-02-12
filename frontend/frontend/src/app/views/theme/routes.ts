import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Theme'
    },
    children: [
      {
        path: '',
        redirectTo: 'todos',
        pathMatch: 'full'
      },
      {
        path: 'todos',
        loadComponent: () => import('./todos-professores/todos-professores.component').then(m => m.TodosProfessoresComponent),
        data: {
          title: 'todos'
        }
      },
      {
        path: 'atualizar',
        loadComponent: () => import('./criar-atualizar-professores/criar-atualizar-professores.component').then(m => m.CriarAtualizarProfessoresComponent),
        data: {
          title: 'atualizar'
        }
      },
      {
        path: 'deletar',
        loadComponent: () => import('./deletar-professor/deletar-professor.component').then(m => m.DeletarProfessorComponent),
        data: {
          title: 'deletar'
        }
      }
    ]
  }
];

