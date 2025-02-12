import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'turmas',
    },
    children: [
      {
        path: '',
        redirectTo: 'turmas',
        pathMatch: 'full',
      },
      {
        path: 'turmas',
        loadComponent: () =>
          import('./todas-as-turmas/todas-as-turmas.component').then(
            (m) => m.TodasAsTurmasComponent
          ),
        data: {
          title: 'turmas',
        },
      },
      {
        path: 'atualizar',
        loadComponent: () =>
          import(
            './criar-atualizar-turmas/criar-atualizar-turmas.component'
          ).then((m) => m.CriarAtualizarTurmasComponent),
        data: {
          title: 'atualizar',
        },
      },
      {
        path: 'deletar',
        loadComponent: () =>
          import('./deletar-turmas/deletar-turmas.component').then(
            (m) => m.DeletarTurmasTurmasComponent
          ),
        data: {
          title: 'deletar',
        },
      },
    ],
  },
];
