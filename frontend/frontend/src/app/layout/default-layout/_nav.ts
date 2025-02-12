import { INavData } from '@coreui/angular';

// Definindo os itens do menu
export const navItems: INavData[] = [
  {
    name: 'Home',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Curso',
    url: '/cursos',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Todos os cursos',
        url: '/cursos/cursos',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Criar Curso/Atualizar',
        url: '/cursos/atualizar',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Deletar Curso',
        url: '/cursos/deletar',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Turmas',
    url: '/turmas',
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'Todas as Turmas',
        url: '/turmas/turmas',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Criar/Atualizar turma',
        url: '/turmas/atualizar',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Deletar Turma',
        url: '/turmas/deletar',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Disciplinas',
    url: '/disciplinas',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Todas as disciplinas',
        url: '/disciplinas/disciplinas',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Criar/Atualizar disciplina',
        url: '/disciplinas/atualizar',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Deletar disciplina',
        url: '/disciplinas/deletar',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Professores',
    iconComponent: { name: 'cil-chart-pie' },
    url: '',
    children: [
      {
        name: 'Todos os professores',
        url: '/professores/todos',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Criar/Atualizar professor',
        url: '/professores/atualizar',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Deletar professor',
        url: '/professores/deletar',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Alunos',
    iconComponent: { name: 'cil-star' },
    url: '',
    children: [
      {
        name: 'Todos os alunos',
        url: '/alunos/todos',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Criar/Atualizar aluno',
        url: '/disciplinas/atualizar-aluno',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Nota e Faltas',
        url: '/disciplinas/nota',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Notificações/Chat',
    url: '/notifications',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Todas as conversas',
        url: '/chat/alerts',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Notificações',
        url: '/chat/notifications',
        icon: 'nav-icon-bullet'
      }
    ]
  }
];
