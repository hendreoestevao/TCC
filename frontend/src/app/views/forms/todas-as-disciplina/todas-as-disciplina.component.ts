import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    ButtonDirective
} from '@coreui/angular';
import { DisciplinasService } from '../../../service/disciplinas/disciplinas.service';

@Component({
    selector: 'app-todas-as-disciplina',
    templateUrl: './todas-as-disciplina.component.html',
    styleUrls: ['./todas-as-disciplina.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

    ]
})
export class TodasAsDisciplinasComponent implements OnInit {
  disciplinas: any[] = []; // Lista de todas as disciplinas
  disciplinasFiltradas: any[] = []; // Lista de disciplinas filtradas
  loading: boolean = true; // Indicador de carregamento
  filtro: string = ''; // Texto do filtro
  userType: string | null = null;
  isAdmin: boolean = false;
  constructor(private disciplinasService: DisciplinasService) {}

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType'); // Obtem o tipo de usuário

    if (this.userType !== 'admin') {
      this.isAdmin = false;
      return;
    }

    this.isAdmin = true;
    this.fetchDisciplinas();
  }

  fetchDisciplinas(): void {
    this.disciplinasService.getDisciplinas().subscribe({
      next: (data) => {
        this.disciplinas = data;
        this.disciplinasFiltradas = [...this.disciplinas]; // Inicializa a lista filtrada
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar disciplinas:', error);
        this.loading = false;
      },
    });
  }

  filtrarDisciplinas(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.disciplinasFiltradas = this.disciplinas.filter((disciplina) =>
      disciplina.nome.toLowerCase().includes(filtroLower) ||
      (disciplina.curso && disciplina.curso.toLowerCase().includes(filtroLower)) ||
      (disciplina.turmas &&
        disciplina.turmas.some((turma: string) => turma.toLowerCase().includes(filtroLower)))
    );
  }

  toggleTurmas(disciplinaId: number): void {
    const disciplina = this.disciplinas.find((d) => d.id === disciplinaId);
    if (disciplina) {
      disciplina.showTurmas = !disciplina.showTurmas;
    }
  }
}
