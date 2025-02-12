import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { RegisterComponent } from './views/pages/register/register.component';
import { LoginComponent } from './views/pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login', // Rota de login
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'register', // Rota de registro
    component: RegisterComponent,
    data: {
      title: 'Register'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'professores',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'cursos',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'turmas',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'disciplinas',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'alunos',
        loadChildren: () => import('./views/todos-alunos/routes').then((m) => m.routes)
      },
      {
        path: 'chat',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      // {
      //   path: 'professores',
      //   loadChildren: () => import('./views/deletar-professor/routes').then((m) => m.routes)
      // },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
];
