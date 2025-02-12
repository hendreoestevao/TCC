import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CursosService } from '../../../service/cursos/cursos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todos-cursos',
  templateUrl: './todos-cursos.component.html',
  styleUrls: ['./todos-cursos.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TodosOsCursosComponent implements OnInit {
  cursos: any[] = [];
  cursosFiltrados: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  filtro: string = '';
  userType: string | null = null;
  isAdmin: boolean = false;

  constructor(private cursosService: CursosService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    this.userType = localStorage.getItem('userType'); // Obtem o tipo de usuário

    if (this.userType !== 'admin') {
      this.isAdmin = false;
      this.loading = false;
      return;
    }

    this.isAdmin = true;

    if (token) {
      this.cursosService.getCursos(token).subscribe(
        (response) => {
          this.cursos = response;
          this.cursosFiltrados = [...this.cursos]; // Inicializa os cursos filtrados
          this.loading = false;
        },
        (error) => {
          this.errorMessage = 'Erro ao carregar os cursos. Tente novamente.';
          this.loading = false;
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  filtrarCursos(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.cursosFiltrados = this.cursos.filter((curso) =>
      curso.nome.toLowerCase().includes(filtroLower) ||
      curso.turmas.some((turma: any) => turma.toLowerCase().includes(filtroLower)) ||
      curso.disciplinas.some((disciplina: any) => disciplina.toLowerCase().includes(filtroLower)) ||
      curso.professores.some((professor: any) => professor.toLowerCase().includes(filtroLower)) ||
      curso.alunos.some((aluno: any) => aluno.toLowerCase().includes(filtroLower))
    );
  }

  toggleCursoDetails(cursoId: number): void {
    const curso = this.cursos.find((c) => c.id === cursoId);
    if (curso) {
      curso.showDetails = !curso.showDetails;
    }
  }

  toggleTurmas(cursoId: number): void {
    const curso = this.cursos.find((c) => c.id === cursoId);
    if (curso) {
      curso.showTurmas = !curso.showTurmas;
    }
  }

  toggleDisciplinas(cursoId: number): void {
    const curso = this.cursos.find((c) => c.id === cursoId);
    if (curso) {
      curso.showDisciplinas = !curso.showDisciplinas;
    }
  }

  toggleProfessores(cursoId: number): void {
    const curso = this.cursos.find((c) => c.id === cursoId);
    if (curso) {
      curso.showProfessores = !curso.showProfessores;
    }
  }

  toggleAlunos(cursoId: number): void {
    const curso = this.cursos.find((c) => c.id === cursoId);
    if (curso) {
      curso.showAlunos = !curso.showAlunos;
    }
  }
}
