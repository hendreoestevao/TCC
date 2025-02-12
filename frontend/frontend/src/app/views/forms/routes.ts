import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Forms',
    },
    children: [
      {
        path: '',
        redirectTo: 'disciplinas',
        pathMatch: 'full',
      },
      {
        path: 'disciplinas',
        loadComponent: () =>
          import('./todas-as-disciplina/todas-as-disciplina.component').then(
            (m) => m.TodasAsDisciplinasComponent
          ),
        data: {
          title: 'disciplinas',
        },
      },
      {
        path: 'atualizar',
        loadComponent: () =>
          import(
            './criar-atualizar-disciplina/criar-atualizar-disciplina.component'
          ).then((m) => m.CriarAtualizarDisciplinasComponent),
        data: {
          title: 'atualizar',
        },
      },
      {
        path: 'deletar',
        loadComponent: () =>
          import('./deletar-disciplina/deletar-disciplina.component').then(
            (m) => m.DeletarDisciplinaComponent
          ),
        data: {
          title: 'deletar',
        },
      },
      {
        path: 'nota',
        loadComponent: () =>
          import('./notas-faltas/notas-faltas.component').then(
            (m) => m.NotasFaltasComponent
          ),
        data: {
          title: 'nota',
        },
      },
      {
        path: 'input-group',
        loadComponent: () =>
          import('./input-groups/input-groups.component').then(
            (m) => m.InputGroupsComponent
          ),
        data: {
          title: 'Input Group',
        },
      },
      {
        path: 'atualizar-aluno',
        loadComponent: () =>
          import(
            './criar-atualizar-aluno/criar-atualizar-aluno.component'
          ).then((m) => m.CriarAtualizarAlunoComponent),
        data: {
          title: 'Floating Labels',
        },
      },
      {
        path: 'layout',
        loadComponent: () =>
          import('./layout/layout.component').then((m) => m.LayoutComponent),
        data: {
          title: 'Layout',
        },
      },
      {
        path: 'validation',
        loadComponent: () =>
          import('./validation/validation.component').then(
            (m) => m.ValidationComponent
          ),
        data: {
          title: 'Validation',
        },
      },
    ],
  },
];
