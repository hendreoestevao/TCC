import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfessoresService } from '../../../service/professores-service/professores.service';
import { FormsModule } from '@angular/forms';
import { CursosService } from 'src/app/service/cursos/cursos.service';
import { DisciplinasService } from 'src/app/service/disciplinas/disciplinas.service';
import { TurmasService } from 'src/app/service/turmas-service/turmas.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-criar-atualizar-professores',
  templateUrl: './criar-atualizar-professores.component.html',
  standalone: true,
  imports: [CommonModule,FormsModule],
})
export class CriarAtualizarProfessoresComponent {
  isModoEdicao: boolean = false;
  isModoCriacao: boolean = true;
  professor: any = {};
  disciplinas: any[] = [];
  turmas: any[] = [];
  cursos: any[] = [];
  professores: any[] = [];
  selectedProfessorId: number | null = null; // Adicionado para corrigir o erro
  userType: string | null = null;
  isAdmin: boolean = false;
  constructor(
    private disciplinasService: DisciplinasService,
    private turmasService: TurmasService,
    private cursosService: CursosService,
    private professoresService: ProfessoresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType'); // Obtem o tipo de usuário

    if (this.userType !== 'admin') {
      this.isAdmin = false;
      return;
    }

    this.isAdmin = true;
    this.loadDisciplinas();
    this.loadTurmas();
    this.loadCursos();
    this.loadProfessores();
  }

  loadProfessores(): void {
    this.professoresService.getProfessores().subscribe(
      (data: any[]) => {
        this.professores = data;
      },
      (error: any) => {
        console.error('Erro ao carregar professores', error);
      }
    );
  }

  onSelectProfessor(event: Event): void {
    const professorId = Number((event.target as HTMLSelectElement).value); // Obtém o ID do professor selecionado
    if (!isNaN(professorId) && professorId !== 0) {
      this.professoresService.getProfessorById(professorId).subscribe(
        (data) => {
          // Atualiza o formulário com os dados do professor
          this.professor = {
            id: data.id,
            username: data.username,
            password: data.password, // Não traz a senha por motivos de segurança
            nome: data.nome,
            sobrenome: data.sobrenome,
            email: data.email,
            disciplinas: data.disciplinas.map((disciplina: any) => disciplina.id),
            turmas: data.turmas.map((turma: any) => turma.id),
            cursos: data.cursos.map((curso: any) => curso.id)
          };
        },
        (error) => {
          console.error('Erro ao carregar o professor', error);
        }
      );
    } else {
      console.error('ID de professor inválido');
    }
  }


  loadDisciplinas(): void {
    this.disciplinasService.getDisciplinas().subscribe(
      (data) => {
        this.disciplinas = data;
      },
      (error) => {
        console.error('Erro ao carregar disciplinas', error);
      }
    );
  }

  loadTurmas(): void {
    this.turmasService.getTurmas().subscribe(
      (data) => {
        this.turmas = data;
      },
      (error) => {
        console.error('Erro ao carregar turmas', error);
      }
    );
  }

  loadCursos(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.cursosService.getCursos(token).subscribe(
        (data) => {
          this.cursos = data;
        },
        (error) => {
          console.error('Erro ao carregar cursos', error);
        }
      );
    } else {
      console.error('Token não encontrado no localStorage');
    }
  }

  salvarProfessor(): void {
    if (this.isModoEdicao && this.selectedProfessorId) {
      this.professoresService.updateProfessor(this.selectedProfessorId, this.professor).subscribe(
        () => {
          Swal.fire('Professor Atualizado!', 'O professor foi atualizado com sucesso!', 'success');
          this.router.navigate(['/professores']);
        },
        (error) => {
          console.error('Erro ao atualizar o professor', error);
          Swal.fire('Erro', 'Não foi possível atualizar o professor.', 'error');
        }
      );
    } else if (this.isModoCriacao) {
      this.professoresService.criarProfessor(this.professor).subscribe(
        () => {
          Swal.fire('Professor Criado!', 'O professor foi criado com sucesso!', 'success');
          this.router.navigate(['/professores']);
        },
        (error) => {
          console.error('Erro ao criar o professor', error);
          Swal.fire('Erro', 'Não foi possível criar o professor.', 'error');
        }
      );
    }
  }

  modoCriacao(): void {
    this.isModoCriacao = true;
    this.isModoEdicao = false;
    this.professor = {};
    this.selectedProfessorId = null;
  }

  modoEdicao(): void {
    this.isModoCriacao = false;
    this.isModoEdicao = true;
    this.selectedProfessorId = null;
  }
}
