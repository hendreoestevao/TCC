import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { DocsExampleComponent } from '@docs-components/public-api';
import {
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbRouterComponent,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  TextColorDirective
} from '@coreui/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CursosService } from 'src/app/service/cursos/cursos.service';
@Component({
  templateUrl: './criar-atualizar-cursos.component.html',
  styleUrls: ['./criar-atualizar-cursos.component.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule , ReactiveFormsModule  ,RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, DocsExampleComponent, BreadcrumbComponent, BreadcrumbItemComponent, NgClass, BreadcrumbRouterComponent]
})

export class CriarAtualizarCursosComponent implements OnInit {
  public cursoForm: FormGroup;
  public cursos: any[] = []; // Lista de cursos
  public cursoSelecionado: number | null = null;
  public loading: boolean = false;  // Variável de carregamento para desabilitar o botão enquanto está aguardando a resposta
  userType: string | null = null;
  isAdmin: boolean = false;
  constructor(
    private cursosService: CursosService,
    private fb: FormBuilder
  ) {
    this.cursoForm = this.fb.group({
      nome: ['']
    });
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType'); // Obtem o tipo de usuário

    if (this.userType !== 'admin') {
      this.isAdmin = false;
      this.loading = false;
      return;
    }

    this.isAdmin = true;
    this.carregarCursos(); // Carrega os cursos ao iniciar
  }

  // Método para carregar os cursos disponíveis
  carregarCursos(): void {
    const token = this.getToken();
    if (token) {
      this.cursosService.getCursos(token).subscribe({
        next: (response: any) => {
          this.cursos = response; // Armazena os cursos na variável
        },
        error: (error: any) => {
          console.error('Erro ao carregar os cursos', error);
        }
      });
    } else {
      console.error('Token não encontrado');
    }
  }

  // Método para carregar o nome do curso selecionado no formulário
  carregarCurso(): void {
    if (this.cursoSelecionado) {
      const curso = this.cursos.find(c => c.id === this.cursoSelecionado);
      if (curso) {
        this.cursoForm.patchValue({ nome: curso.nome });
      }
    }
  }

  // Método para recuperar o token do localStorage
  private getToken(): string | null {
    return localStorage.getItem('authToken');  // Substitua 'authToken' pela chave real usada para armazenar o token
  }

  // Método para criar um novo curso
  criarCurso(): void {
    const nome = this.cursoForm.value.nome;
    const token = this.getToken();
    if (token) {
      this.loading = true;
      this.cursosService.criarCurso(nome, token).subscribe({
        next: (response: any) => {
          Swal.fire('Sucesso!', 'Curso criado com sucesso!', 'success'); // SweetAlert2 para sucesso
          this.carregarCursos(); // Recarrega a lista de cursos
          this.cursoForm.reset();  // Limpa o formulário após criação
        },
        error: (error: any) => {
          Swal.fire('Erro!', 'Erro ao criar curso', 'error'); // SweetAlert2 para erro
          console.error('Erro ao criar curso:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      Swal.fire('Erro!', 'Token não encontrado', 'error'); // SweetAlert2 para erro
    }
  }

  // Método para atualizar o curso
  atualizarCurso(): void {
    const nome = this.cursoForm.value.nome;
    const token = this.getToken();

    if (this.cursoSelecionado && token) {
      this.loading = true;
      this.cursosService.atualizarCurso(this.cursoSelecionado, nome, token).subscribe({
        next: (response: any) => {
          Swal.fire('Sucesso!', 'Curso atualizado com sucesso!', 'success'); // SweetAlert2 para sucesso
          this.carregarCursos(); // Recarrega a lista de cursos após atualização
        },
        error: (error: any) => {
          Swal.fire('Erro!', 'Erro ao atualizar curso', 'error'); // SweetAlert2 para erro
          console.error('Erro ao atualizar curso:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      Swal.fire('Erro!', 'Token não encontrado ou curso não selecionado', 'error'); // SweetAlert2 para erro
    }
  }

  salvarCurso(): void {
    const nome = this.cursoForm.value.nome; // Obtém o nome do formulário
    const token = this.getToken();

    if (!token) {
      Swal.fire('Erro!', 'Token não encontrado', 'error');
      return;
    }

    if (this.cursoSelecionado) {
      // Atualizar curso
      this.loading = true;
      this.cursosService.atualizarCurso(this.cursoSelecionado, nome, token).subscribe({
        next: () => {
          Swal.fire('Sucesso!', 'Curso atualizado com sucesso!', 'success');
          this.carregarCursos();
          this.resetarFormulario();
        },
        error: (error: any) => {
          Swal.fire('Erro!', 'Erro ao atualizar o curso', 'error');
          console.error(error);
        },
        complete: () => (this.loading = false),
      });
    } else {
      // Criar curso
      this.loading = true;
      this.cursosService.criarCurso(nome, token).subscribe({
        next: () => {
          Swal.fire('Sucesso!', 'Curso criado com sucesso!', 'success');
          this.carregarCursos();
          this.resetarFormulario();
        },
        error: (error: any) => {
          Swal.fire('Erro!', 'Erro ao criar o curso', 'error');
          console.error(error);
        },
        complete: () => (this.loading = false),
      });
    }
  }

  // Função para resetar o formulário
  resetarFormulario(): void {
    this.cursoForm.reset();
    this.cursoSelecionado = null; // Limpa a seleção
  }
}
