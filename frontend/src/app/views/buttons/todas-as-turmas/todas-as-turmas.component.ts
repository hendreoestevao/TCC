import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { DocsExampleComponent } from '@docs-components/public-api';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  TextColorDirective
} from '@coreui/angular';
import { TurmasService } from '../../../service/turmas-service/turmas.service'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-todas-as-turmas',
  templateUrl: './todas-as-turmas.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TodasAsTurmasComponent {
  turmas: any[] = []; // Array de todas as turmas
  turmasFiltradas: any[] = []; // Array de turmas filtradas
  filtro: string = ''; // Texto do filtro
  userType: string | null = null;
  isAdmin: boolean = false;
  constructor(private turmasService: TurmasService) {}

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType'); // Obtem o tipo de usuário

    if (this.userType !== 'admin') {
      this.isAdmin = false;
      return;
    }

    this.isAdmin = true;
    this.fetchTurmas();
  }

  fetchTurmas(): void {
    this.turmasService.getTurmas().subscribe({
      next: (data) => {
        this.turmas = data;
        this.turmasFiltradas = [...this.turmas]; // Inicializa com todas as turmas
      },
      error: (error) => {
        console.error('Erro ao buscar turmas:', error);
      },
    });
  }

  toggleDetails(turmaId: number): void {
    const turma = this.turmas.find((t) => t.id === turmaId);
    if (turma) {
      turma.showDetails = !turma.showDetails;
    }
  }

  filtrarTurmas(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.turmasFiltradas = this.turmas.filter((turma) =>
      turma.periodo.toLowerCase().includes(filtroLower) ||
      (turma.cursoNome && turma.cursoNome.toLowerCase().includes(filtroLower)) ||
      (turma.alunos &&
        turma.alunos.some((aluno: any) =>
          `${aluno.nome} ${aluno.sobrenome}`.toLowerCase().includes(filtroLower)
        )) ||
      (turma.disciplinas &&
        turma.disciplinas.some((disciplina: any) =>
          disciplina.nome.toLowerCase().includes(filtroLower)
        )) ||
      (turma.professores &&
        turma.professores.some((professor: any) =>
          `${professor.nome} ${professor.sobrenome}`.toLowerCase().includes(filtroLower)
        ))
    );
  }
}
