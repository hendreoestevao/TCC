import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { DocsExampleComponent } from '@docs-components/public-api';
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
import { CursosService } from 'src/app/service/cursos/cursos.service';

@Component({
  selector: 'app-deletar-cursos',
  templateUrl: './deletar-cursos.component.html',
  styleUrls: ['./deletar-cursos.component.scss'],
  standalone: true,
  imports: [CommonModule ,FormsModule, RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, DocsExampleComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, IconDirective, TabDirective, TabsContentComponent, TabPanelComponent]
})
export class DeletarCursosComponent {
  public cursos: any[] = [];
  public cursoSelecionado: number | null = null; // Armazena o curso selecionado
  userType: string | null = null;
  isAdmin: boolean = false;
  constructor(private cursosService: CursosService) {}

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType'); // Obtem o tipo de usuário

    if (this.userType !== 'admin') {
      this.isAdmin = false;
      return;
    }

    this.isAdmin = true;
    this.carregarCursos();
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');  // Substitua 'authToken' pela chave real usada para armazenar o token
  }

  // Método para carregar os cursos
  carregarCursos(): void {
    const token = this.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Token inválido ou ausente!',
      });
      return;
    }
    this.cursosService.getCursos(token).subscribe({
      next: (response: any) => {
        this.cursos = response;
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Erro ao carregar os cursos',
        });
        console.error(error);
      }
    });
  }

  deletarCurso(): void {
    const token = this.getToken();
    if (!token || !this.cursoSelecionado) {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Selecione um curso para deletar!',
      });
      return;
    }

    const cursoId = this.cursoSelecionado;

    // Alerta de confirmação antes de deletar
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você deseja realmente deletar este curso? Essa ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cursosService.deletarCurso(cursoId, token).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Curso deletado!',
              text: 'O curso foi deletado com sucesso!',
            }).then(() => {
              this.carregarCursos(); // Recarregar a lista de cursos
              this.cursoSelecionado = null; // Limpar a seleção após a exclusão
            });
          },
          error: (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: 'Erro ao deletar o curso.',
            });
            console.error(error);
          },
        });
      }
    });
  }
}
