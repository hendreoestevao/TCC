import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Notifications',
    },
    children: [
      {
        path: '',
        redirectTo: 'notifications',
        pathMatch: 'full',
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./todas-conversas/todas-conversas.component').then(
            (m) => m.TodasConversasComponent
          ),
        data: {
          title: 'Alerts',
        },
      },
      {
        path: 'chat/:teacherId/:studentId',
        loadComponent: () =>
          import('./chat/chat.component').then((m) => m.ChatComponent),
        data: {
          title: 'Chat',
        },
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./notificacoes/notificacoes.component').then(
            (m) => m.NotificacoesComponent
          ),
        data: {
          title: 'notifications',
        },
      },
      {
        path: 'modal',
        loadComponent: () =>
          import('./modals/modals.component').then((m) => m.ModalsComponent),
        data: {
          title: 'Modal',
        },
      },
      {
        path: 'toasts',
        loadComponent: () =>
          import('./toasters/toasters.component').then(
            (m) => m.ToastersComponent
          ),
        data: {
          title: 'Toasts',
        },
      },
    ],
  },
];
