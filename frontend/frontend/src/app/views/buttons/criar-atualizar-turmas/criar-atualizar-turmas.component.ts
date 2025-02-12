import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DocsExampleComponent } from '@docs-components/public-api';
import {
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonGroupComponent,
  ButtonDirective,
  FormCheckLabelDirective,
  ButtonToolbarComponent,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ThemeDirective,
  DropdownComponent,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  DropdownDividerDirective,
} from '@coreui/angular';
import { TurmasService } from 'src/app/service/turmas-service/turmas.service';
import { CommonModule } from '@angular/common';
import { CursosService } from 'src/app/service/cursos/cursos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criar-atualizar-turmas',
  templateUrl: './criar-atualizar-turmas.component.html',
  styleUrls: ['./criar-atualizar-turmas.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    DocsExampleComponent,
    ButtonGroupComponent,
    ButtonDirective,
    RouterLink,
    ReactiveFormsModule,
    FormCheckLabelDirective,
    ButtonToolbarComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,
    ThemeDirective,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    DropdownDividerDirective,
  ],
})
export class CriarAtualizarTurmasComponent {
  turmaForm: UntypedFormGroup;
  isEditMode = false;
  turmaId: number | null = null;
  turmas: any[] = [];
  cursos: any[] = [];
  userType: string | null = null;
  isAdmin: boolean = false;
  constructor(
    private fb: UntypedFormBuilder,
    private turmasService: TurmasService,
    private cursosService: CursosService,
    private router: Router
  ) {
    this.turmaForm = this.fb.group({
      periodo: ['', [Validators.required]],
      cursoId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType'); // Obtem o tipo de usuário

    if (this.userType !== 'admin') {
      this.isAdmin = false;
      return;
    }

    this.isAdmin = true;

    this.loadTurmas();
    this.loadCursos();
  }

  // Carregar turmas existentes
  loadTurmas() {
    this.turmasService.getTurmas().subscribe({
      next: (data) => {
        this.turmas = data;
      },
      error: (err) => {
        console.error('Erro ao buscar turmas:', err);
        Swal.fire('Erro', 'Erro ao carregar turmas!', 'error'); // Notificação de erro
      },
    });
  }

  // Carregar cursos disponíveis
  loadCursos() {
    const token = localStorage.getItem('authToken'); // Pega o token do localStorage
    if (token) {
      this.cursosService.getCursos(token).subscribe({
        next: (data) => {
          this.cursos = data; // Armazena os cursos
        },
        error: (err) => {
          console.error('Erro ao buscar cursos:', err);
          Swal.fire('Erro', 'Erro ao carregar cursos!', 'error'); // Notificação de erro
        },
      });
    }
  }

  // Método para inicializar em modo de edição
  loadTurmaForEdit(turma: any) {
    this.isEditMode = true;
    this.turmaId = turma.id;
    this.turmaForm.patchValue({
      periodo: turma.periodo,
      cursoId: turma.curso.id,
    });
  }

  // Salvar os dados (criar ou atualizar)
  onSubmit() {
    if (this.turmaForm.invalid) {
      return;
    }

    const turmaData = {
      periodo: this.turmaForm.value.periodo,
      curso: { id: this.turmaForm.value.cursoId },
    };

    if (this.isEditMode && this.turmaId) {
      this.turmasService.updateTurma(this.turmaId, turmaData).subscribe({
        next: () => {
          Swal.fire('Sucesso', 'Turma atualizada com sucesso!', 'success'); // Notificação de sucesso
          this.router.navigate(['/turmas']);
        },
        error: (err) => {
          console.error('Erro ao atualizar turma:', err);
          Swal.fire('Erro', 'Erro ao atualizar turma!', 'error'); // Notificação de erro
        },
      });
    } else {
      this.turmasService.createTurma(turmaData).subscribe({
        next: () => {
          Swal.fire('Sucesso', 'Turma criada com sucesso!', 'success'); // Notificação de sucesso
          this.router.navigate(['/turmas']);
        },
        error: (err) => {
          console.error('Erro ao criar turma:', err);
          Swal.fire('Erro', 'Erro ao criar turma!', 'error'); // Notificação de erro
        },
      });
    }
  }

  onSelectTurma(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const turmaId = selectElement.value;

    if (!turmaId) {
      this.isEditMode = false;
      this.turmaForm.reset();
      return;
    }

    const selectedTurma = this.turmas.find((turma) => turma.id === +turmaId);
    if (selectedTurma) {
      this.loadTurmaForEdit(selectedTurma);
    }
  }
}
