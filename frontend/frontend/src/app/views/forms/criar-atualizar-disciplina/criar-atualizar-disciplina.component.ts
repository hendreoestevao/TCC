import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DisciplinasService } from 'src/app/service/disciplinas/disciplinas.service';
import { CommonModule } from '@angular/common';
import { CursosService } from 'src/app/service/cursos/cursos.service';
import { TurmasService } from 'src/app/service/turmas-service/turmas.service';

@Component({
  selector: 'app-criar-atualizar-disciplina',
  templateUrl: './criar-atualizar-disciplina.component.html',
  styleUrls: ['./criar-atualizar-disciplina.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],  // Certifique-se de importar ReactiveFormsModule e CommonModule
})
export class CriarAtualizarDisciplinasComponent implements OnInit {
  disciplinaForm: FormGroup;
  disciplinas: any[] = [];
  cursos: any[] = [];
  turmas: any[] = [];
  isModoCriacao: boolean = true;
  isModoEdicao: boolean = false;
  selectedDisciplinaId: number | null = null;
  isLoadingDisciplinas: boolean = false;
  userType: string | null = null;
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private disciplinasService: DisciplinasService,
    private cursosService: CursosService,
    private turmasService: TurmasService,
    private router: Router
  ) {
    this.disciplinaForm = this.fb.group({
      nome: ['', Validators.required],
      cargaHoraria: ['', [Validators.required, Validators.min(1)]],
      notaMaxima: ['', [Validators.required, Validators.min(0)]],
      cursoId: [null, Validators.required], // Curso associado
      turmaIds: [[], Validators.required], // Turmas associadas
    });
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType'); // Obtem o tipo de usuário

    if (this.userType !== 'admin') {
      this.isAdmin = false;
      return;
    }

    this.isAdmin = true;

    this.loadDisciplinas();
    this.loadCursos();
    this.loadTurmas();
  }

  loadDisciplinas(): void {
    this.isLoadingDisciplinas = true;
    this.disciplinasService.getDisciplinas().subscribe({
      next: (data) => {
        this.disciplinas = data;
        this.isLoadingDisciplinas = false;
      },
      error: () => {
        this.isLoadingDisciplinas = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Ocorreu um erro ao carregar as disciplinas.',
        });
      },
    });
  }

  loadCursos(): void {
    const token = localStorage.getItem('authToken');
    if(token){
      this.cursosService.getCursos(token).subscribe({
        next: (data: any[]) => {
          this.cursos = data;
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Ocorreu um erro ao carregar os cursos.',
          });
        },
      });
    }

  }

  loadTurmas(): void {
    this.turmasService.getTurmas().subscribe({
      next: (data: any[]) => {
        this.turmas = data;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Ocorreu um erro ao carregar as turmas.',
        });
      },
    });
  }

  modoCriacao(): void {
    this.isModoCriacao = true;
    this.isModoEdicao = false;
    this.selectedDisciplinaId = null;
    this.disciplinaForm.reset();
  }

  modoEdicao(): void {
    this.isModoCriacao = false;
    this.isModoEdicao = true;
    if (this.disciplinas.length === 0) {
      this.loadDisciplinas();
    }
  }

  onSelectDisciplina(event: Event): void {
    const disciplinaId = Number((event.target as HTMLSelectElement).value);

    if (!disciplinaId) {
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Selecione uma disciplina válida.',
      });
      return;
    }

    this.selectedDisciplinaId = disciplinaId;
    const disciplina = this.disciplinas.find((d) => d.id === disciplinaId);

    if (disciplina) {
      this.disciplinaForm.patchValue(disciplina); // Preenche o formulário com os dados da disciplina
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Disciplina não encontrada.',
      });
    }
  }

  onSubmit(): void {


    const disciplina = this.disciplinaForm.value;

    if (this.isModoCriacao) {
      this.disciplinasService.criarDisciplina(disciplina).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Disciplina criada com sucesso!',
            showConfirmButton: false,
            timer: 1500,
          });
          this.loadDisciplinas();
          this.modoCriacao();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Ocorreu um erro ao criar a disciplina!',
          });
        },
      });
    } else if (this.isModoEdicao && this.selectedDisciplinaId) {
      const payload = { ...disciplina, id: this.selectedDisciplinaId };

      this.disciplinasService.atualizarDisciplina(this.selectedDisciplinaId, payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Disciplina atualizada com sucesso!',
            showConfirmButton: false,
            timer: 1500,
          });
          this.loadDisciplinas();
          this.modoCriacao();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Ocorreu um erro ao atualizar a disciplina!',
          });
        },
      });
    }
  }
}
