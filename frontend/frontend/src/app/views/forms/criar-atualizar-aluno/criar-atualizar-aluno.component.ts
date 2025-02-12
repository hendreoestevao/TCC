import { Component, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { ReactiveFormsModule, FormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DocsExampleComponent } from '@docs-components/public-api';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FormFloatingDirective, FormControlDirective, FormLabelDirective, FormDirective, FormSelectDirective, GutterDirective } from '@coreui/angular';
import { CursosService } from 'src/app/service/cursos/cursos.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AlunoService } from 'src/app/service/aluno-service/aluno.service';
import { TurmasService } from 'src/app/service/turmas-service/turmas.service';

@Component({
    selector: 'app-criar-atualizar-aluno',
    templateUrl: './criar-atualizar-aluno.component.html',
    styleUrls: ['./criar-atualizar-aluno.component.scss'],
    standalone: true,
    imports: [ ReactiveFormsModule, FormsModule, CommonModule,  ReactiveFormsModule]
})
export class CriarAtualizarAlunoComponent implements OnInit {
  alunoForm!: FormGroup;
  cursos: any[] = [];
  turmas: any[] = []; // Turmas carregadas
  alunos: any[] = [];
  isModoCriacao: boolean = true;
  selectedAlunoId: number | null = null;
  userType: string | null = null;
  isAdmin: boolean = false;
  constructor(
    private fb: FormBuilder,
    private cursosService: CursosService,
    private alunoService: AlunoService,
    private turmasService: TurmasService // Adicione o TurmasService
  ) {}

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType'); // Obtem o tipo de usuário

    if (this.userType !== 'admin') {
      this.isAdmin = false;
      return;
    }

    this.isAdmin = true;
    this.inicializarFormulario();
    this.carregarCursos();
    this.carregarAlunos();
    this.carregarTurmas(); // Carrega as turmas na inicialização
  }

  inicializarFormulario(): void {
    this.alunoForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ra: ['', Validators.required],
      senha: ['', Validators.required],
      curso: ['', Validators.required],
      turmas: ['', Validators.required], // Campo para selecionar a turma
    });
  }

  carregarCursos(): void {
    const token = localStorage.getItem('authToken') || '';
    this.cursosService.getCursos(token).subscribe({
      next: (data) => {
        this.cursos = data;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao carregar cursos. Tente novamente mais tarde.',
        });
      },
    });
  }

  carregarTurmas(): void {
    this.turmasService.getTurmas().subscribe({
      next: (data: any[]) => {
        this.turmas = data; // Armazena as turmas
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao carregar turmas. Tente novamente mais tarde.',
        });
      },
    });
  }

  carregarAlunos(): void {
    this.alunoService.getTodosAlunos().subscribe({
      next: (data) => {
        this.alunos = data;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao carregar alunos. Tente novamente mais tarde.',
        });
      },
    });
  }

  modoCriacao(): void {
    this.isModoCriacao = true;
    this.selectedAlunoId = null;
    this.alunoForm.reset();
  }

  modoEdicao(): void {
    this.isModoCriacao = false;
    if (this.alunos.length === 0) {
      this.carregarAlunos();
    }
  }

  selecionarAluno(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (!target) return;

    const alunoId = Number(target.value);
    this.selectedAlunoId = alunoId;

    const aluno = this.alunos.find((a) => a.id === alunoId);
    if (aluno) {
      this.alunoForm.patchValue({
        nome: aluno.nome,
        sobrenome: aluno.sobrenome,
        email: aluno.email,
        ra: aluno.ra,
        senha: aluno.senha,
        curso: this.cursos.find((curso) => curso.nome === aluno.cursoNome)?.id || '',
        turmas: aluno.turmas[0]?.id || '', // Seleciona a turma pelo ID
      });
    }
  }

  onSubmit(): void {
    if (this.alunoForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    const aluno = {
      nome: this.alunoForm.value.nome,
      sobrenome: this.alunoForm.value.sobrenome,
      email: this.alunoForm.value.email,
      ra: this.alunoForm.value.ra,
      senha: this.alunoForm.value.senha,
      cursoNome: this.cursos.find((curso) => curso.id === this.alunoForm.value.curso)?.nome || '',
      turmas: [this.alunoForm.value.turmas],
      roleNome: 'ALUNO',
    };

    if (this.isModoCriacao) {
      console.log(aluno)
      this.alunoService.criarAluno(aluno).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Aluno criado com sucesso!',
          });
          this.carregarAlunos();
          this.modoCriacao();
        },
        error: (error) => {

          console.error('Erro ao criar aluno:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao criar aluno!',
            text: error.message || 'Tente novamente mais tarde.',
          });
        },
      });
    } else if (this.selectedAlunoId) {
      const ra = this.alunoForm.value.ra; // Obtém o RA do formulário

      this.alunoService.atualizarAluno(ra, aluno).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Aluno atualizado com sucesso!',
          });
          this.carregarAlunos();
          this.modoCriacao();
        },
        error: (error) => {
          console.error('Erro ao atualizar aluno:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar aluno!',
            text: error.message || 'Tente novamente mais tarde.',
          });
        },
      });
    }
  }
}
