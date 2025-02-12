import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Base',
    },
    children: [
      {
        path: '',
        redirectTo: 'cards',
        pathMatch: 'full',
      },
      {
        path: 'cursos',
        loadComponent: () =>
          import('./todos-cursos/todos-cursos.component').then(
            (m) => m.TodosOsCursosComponent
          ),
        data: {
          title: 'cursos',
        },
      },
      {
        path: 'atualizar',
        loadComponent: () =>
          import(
            './criar-atualizar-cursos/criar-atualizar-cursos.component'
          ).then((m) => m.CriarAtualizarCursosComponent),
        data: {
          title: 'atualizar',
        },
      },
      {
        path: 'deletar',
        loadComponent: () =>
          import('./deletar-cursos/deletar-cursos.component').then(
            (m) => m.DeletarCursosComponent
          ),
        data: {
          title: 'deletar',
        },
      },
    ],
  },
];
