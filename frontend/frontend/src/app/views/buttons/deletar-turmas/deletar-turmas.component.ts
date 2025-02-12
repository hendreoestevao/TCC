import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DocsExampleComponent } from '@docs-components/public-api';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonGroupComponent, ButtonDirective, FormCheckLabelDirective, ButtonToolbarComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, DropdownDividerDirective } from '@coreui/angular';
import { TurmasService } from 'src/app/service/turmas-service/turmas.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-deletar-turmas',
    templateUrl: './deletar-turmas.component.html',

    standalone: true,
    imports: [CommonModule, RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, DocsExampleComponent, ButtonGroupComponent, ButtonDirective, RouterLink, ReactiveFormsModule, FormCheckLabelDirective, ButtonToolbarComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, DropdownDividerDirective]
})
export class DeletarTurmasTurmasComponent {
  turmaForm: UntypedFormGroup;
  turmas: any[] = [];
  turmaId: number | null = null;
  userType: string | null = null;
  isAdmin: boolean = false;
  constructor(
    private fb: UntypedFormBuilder,
    private turmasService: TurmasService,
    private router: Router
  ) {
    this.turmaForm = this.fb.group({
      periodo: ['', [Validators.required]],
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

  // Quando o usuário seleciona uma turma
  onSelectTurma(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.turmaId = selectElement.value ? +selectElement.value : null;
  }

  // Deletar turma selecionada
  onDeleteTurma() {
    if (this.turmaId) {
      Swal.fire({
        title: 'Tem certeza?',
        text: 'Você não poderá desfazer essa ação!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, deletar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.turmasService.deletarTurma(this.turmaId!).subscribe({
            next: () => {
              Swal.fire(
                'Deletada!',
                'A turma foi deletada com sucesso.',
                'success'
              );
              this.loadTurmas(); // Recarrega as turmas após exclusão
              this.turmaId = null; // Reseta a seleção
            },
            error: (err) => {
              console.error('Erro ao deletar turma:', err);
              Swal.fire(
                'Erro',
                'Houve um problema ao deletar a turma.',
                'error'
              );
            },
          });
        }
      });
    }
  }
}
