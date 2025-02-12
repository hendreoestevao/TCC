import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  BorderDirective,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardGroupComponent,
  CardHeaderComponent,
  CardImgDirective,
  CardLinkDirective,
  CardSubtitleDirective,
  CardTextDirective,
  CardTitleDirective,
  ColComponent,
  GutterDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  RowComponent,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  TextColorDirective
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { ProfessoresService } from '../../../service/professores-service/professores.service'

@Component({
  selector: 'app-deletar-professores',
  templateUrl: './deletar-professor.component.html',
  standalone: true,
  imports: [CommonModule ,FormsModule, RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, IconDirective, TabDirective, TabsContentComponent, TabPanelComponent]
})
export class DeletarProfessorComponent implements OnInit{
  professores: any[] = [];  // Lista de professores
  professorId!: number;     // ID do professor a ser excluído
  userType: string | null = null;
  isAdmin: boolean = false;
  constructor(private professoresService: ProfessoresService) { }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType'); // Obtem o tipo de usuário

    if (this.userType !== 'admin') {
      this.isAdmin = false;
      return;
    }

    this.isAdmin = true;
    // Chama o serviço para pegar todos os professores quando o componente for inicializado
    this.professoresService.getProfessores().subscribe(
      (dados) => {
        this.professores = dados;
      },
      (error) => {
        Swal.fire('Erro!', 'Não foi possível carregar os professores.', 'error');
      }
    );
  }

  deletarProfessor() {
    if (this.professorId !== null) {
      // Exibir uma confirmação usando SweetAlert2
      Swal.fire({
        title: 'Tem certeza?',
        text: 'Você não poderá reverter essa ação!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Chama o método de deletar do serviço, passando o tipo 'number'
          this.professoresService.deletarProfessor(this.professorId).subscribe(
            () => {
              // Sucesso: professor deletado
              Swal.fire(
                'Deletado!',
                'O professor foi excluído com sucesso.',
                'success'
              ).then(() => {
                // Recarregar a lista de professores após a exclusão
                this.ngOnInit();
              });
            },
            (error) => {
              // Erro ao tentar deletar o professor
              Swal.fire(
                'Erro!',
                'Não foi possível deletar o professor. Tente novamente mais tarde.',
                'error'
              );
            }
          );
        }
      });
    } else {
      // Se professorId for null, exibe um alerta para o usuário
      Swal.fire(
        'Erro!',
        'Por favor, forneça um ID de professor válido.',
        'error'
      );
    }
  }

  setProfessorId(event: Event) {
    const selectElement = event.target as HTMLSelectElement; // Afirma que target é um select
    const id = Number(selectElement.value);

    if (!isNaN(id)) {
      this.professorId = id;
    } else {
      // Tratar o caso onde o valor não é válido
      console.error('ID do professor inválido:', selectElement.value);
      this.professorId = null!; // Atribuir null, que pode ser tratado depois
    }
  }
}
