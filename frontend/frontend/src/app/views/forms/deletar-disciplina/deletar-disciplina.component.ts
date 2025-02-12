import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DocsExampleComponent } from '@docs-components/public-api';
import { RowComponent, FormDirective, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonGroupComponent, ButtonDirective } from '@coreui/angular';
import { DisciplinasService } from 'src/app/service/disciplinas/disciplinas.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-deletar-disciplina',
    templateUrl: './deletar-disciplina.component.html',
    styleUrls: ['./deletar-disciplina.component.scss'],
    standalone: true,
    imports: [CommonModule, RowComponent, ReactiveFormsModule, FormDirective, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, DocsExampleComponent, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonGroupComponent, ButtonDirective]
})
export class DeletarDisciplinaComponent implements OnInit {
  disciplinas: any[] = [];
  userType: string | null = null;
  isAdmin: boolean = false
  constructor(private disciplinasService: DisciplinasService) {
    this.loadDisciplinas();
  }
  ngOnInit(): void {
    this.userType = localStorage.getItem('userType'); // Obtem o tipo de usuário

    if (this.userType !== 'admin') {
      this.isAdmin = false;
      return;
    }

    this.isAdmin = true;
  }

  // Carrega as disciplinas
  loadDisciplinas() {
    this.disciplinasService.getDisciplinas().subscribe({
      next: (data) => {
        this.disciplinas = data;
      },
      error: (err) => {
        console.error('Erro ao carregar disciplinas:', err);
        Swal.fire('Erro', 'Erro ao carregar disciplinas!', 'error');
      }
    });
  }

  // Deleta a disciplina selecionada
  deletarDisciplina(id: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.disciplinasService.deletarDisciplina(id).subscribe({
          next: () => {
            Swal.fire('Deletado!', 'A disciplina foi deletada.', 'success');
            this.loadDisciplinas(); // Recarrega a lista após excluir
          },
          error: () => {
            Swal.fire('Erro', 'Ocorreu um erro ao deletar a disciplina!', 'error');
          }
        });
      }
    });
  }
}
