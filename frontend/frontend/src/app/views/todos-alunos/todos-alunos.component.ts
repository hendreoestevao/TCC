import { Component } from '@angular/core';
import { AlunoService } from '../../service/aluno-service/aluno.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todos-alunos',
  templateUrl: './todos-alunos.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class TodosAlunosComponent {
  alunos: any[] = [];
  alunosFiltrados: any[] = []; // Lista para exibição após o filtro
  filtro: string = ''; // Texto do filtro
  userType: string | null = '';
  turmaId: string | null = '';

  constructor(private alunoService: AlunoService) {}

  ngOnInit() {
    this.userType = localStorage.getItem('userType'); // Obtém o tipo de usuário
    if (this.userType === 'professor') {
      this.turmaId = localStorage.getItem('turmaId'); // Obtém o ID da turma do professor
      if (this.turmaId) {
        this.getAlunosPorTurma(Number(this.turmaId));
      } else {
        console.warn('Nenhum turmaId encontrado no localStorage.');
      }
    } else {
      this.getTodosAlunos();
    }
  }

  // Busca todos os alunos (para admins ou outros usuários)
  getTodosAlunos(): void {
    this.alunoService.getTodosAlunos().subscribe(
      (response: any) => {
        this.alunos = response.filter((aluno: any) => typeof aluno === 'object');
        this.alunosFiltrados = [...this.alunos]; // Inicializa com todos os alunos
      },
      (error: any) => {
        console.error('Erro ao carregar todos os alunos:', error);
      }
    );
  }

  // Busca alunos pela turma (para professores)
  getAlunosPorTurma(turmaId: number): void {
    this.alunoService.getAlunosPorTurma(turmaId).subscribe(
      (response: any) => {
        this.alunos = response.filter((aluno: any) => typeof aluno === 'object');
        this.alunosFiltrados = [...this.alunos]; // Inicializa com os alunos da turma

      },
      (error: any) => {
        console.error(`Erro ao carregar os alunos da turma ${turmaId}:`, error);
      }
    );
  }

  // Filtrar alunos com base no texto de entrada
  filtrarAlunos(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.alunosFiltrados = this.alunos.filter(aluno =>
      aluno.nome.toLowerCase().includes(filtroLower) ||
      aluno.sobrenome.toLowerCase().includes(filtroLower) ||
      aluno.ra.toLowerCase().includes(filtroLower) ||
      aluno.cursoNome.toLowerCase().includes(filtroLower) ||
      aluno.roleNome.toLowerCase().includes(filtroLower)
    );
  }
}
