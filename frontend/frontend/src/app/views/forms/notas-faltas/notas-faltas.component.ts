import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DisciplinasService } from 'src/app/service/disciplinas/disciplinas.service'; // Serviço de disciplinas
import { AlunoService } from 'src/app/service/aluno-service/aluno.service'; // Serviço de alunos

@Component({
  selector: 'app-notas-faltas',
  templateUrl: './notas-faltas.component.html',
  styleUrls: ['./notas-faltas.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class NotasFaltasComponent implements OnInit {
  // Dados do formulário
  raAluno: string = '';
  disciplinaId: number = 0;
  nota: number = 0;
  faltas: number = 0;

  // Listagem de alunos e disciplinas
  alunos: any[] = [];
  disciplinas: any[] = [];
  isProfessor: boolean = false; // Flag para determinar se o usuário é professor

  // URL da API
  apiUrl: string = 'http://localhost:8080/api/registros';

  constructor(
    private http: HttpClient,
    private disciplinasService: DisciplinasService,
    private alunoService: AlunoService
  ) {}

  ngOnInit(): void {
    const userType = localStorage.getItem('userType');
    this.isProfessor = userType === 'professor'; // Define se o usuário é professor

    if (this.isProfessor) {
      const turmaId = localStorage.getItem('turmaId');
      if (turmaId) {
        this.carregarAlunosPorTurma(Number(turmaId)); // Carrega alunos associados à turma do professor
      }
      this.carregarDisciplinasDoProfessor(); // Carrega disciplinas do professor
    } else {
      this.carregarTodosAlunos(); // Admin ou outros usuários veem todos os alunos
      this.carregarDisciplinas();
    }
  }


  // Carregar todos os alunos (para admin)
  carregarTodosAlunos(): void {
    this.alunoService.getTodosAlunos().subscribe({
      next: (data) => {
        this.alunos = data;
      },
      error: (error) => {
        console.error('Erro ao carregar todos os alunos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar alunos',
          text: 'Não foi possível carregar os alunos.',
        });
      }
    });
  }

  // Carregar alunos por turma (para professor)
  carregarAlunosPorTurma(turmaId: number): void {
    this.alunoService.getAlunosPorTurma(turmaId).subscribe({
      next: (data) => {
        this.alunos = data;
      },
      error: (error) => {
        console.error('Erro ao carregar alunos da turma:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar alunos',
          text: 'Não foi possível carregar os alunos da turma.',
        });
      }
    });
  }

  // Carregar disciplinas para admin
  carregarDisciplinas(): void {
    this.disciplinasService.getDisciplinas().subscribe({
      next: (data) => {
        this.disciplinas = data;
      },
      error: (error) => {
        console.error('Erro ao carregar disciplinas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar disciplinas',
          text: 'Não foi possível carregar as disciplinas.',
        });
      },
    });
  }

  // Carregar disciplinas do professor
  carregarDisciplinasDoProfessor(): void {
    const disciplinasSalvas = localStorage.getItem('disciplinas'); // Verifica se há disciplinas no localStorage

    if (disciplinasSalvas) {
      // Recupera disciplinas diretamente do localStorage
      this.disciplinas = JSON.parse(disciplinasSalvas);
    } else {
      console.error('Nenhuma disciplina encontrada no localStorage. Verifique o processo de login.');
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar disciplinas',
        text: 'Disciplinas não encontradas. Faça login novamente para atualizar as informações.',
      });
    }
  }




  // Método para cadastrar os dados (POST)
  cadastrar(): void {
    const dados = {
      raAluno: this.raAluno,
      disciplinaId: this.disciplinaId,
      nota: this.nota,
      faltas: this.faltas
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(this.apiUrl, dados, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Erro ao enviar os dados:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao enviar os dados',
            text: 'Houve um problema ao enviar os dados. Tente novamente mais tarde.',
          });
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Dados enviados com sucesso!',
            text: 'Os dados foram enviados com sucesso.',
          });
        }
      });
  }

  // Método para atualizar os dados (PUT)
  atualizar(): void {
    const dados = {
      raAluno: this.raAluno,
      disciplinaId: this.disciplinaId,
      nota: this.nota,
      faltas: this.faltas
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.put(this.apiUrl, dados, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Erro ao atualizar os dados:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar os dados',
            text: 'Houve um problema ao atualizar os dados. Tente novamente mais tarde.',
          });
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Dados atualizados com sucesso!',
            text: 'Os dados foram atualizados com sucesso.',
          });
        }
      });
  }
}
