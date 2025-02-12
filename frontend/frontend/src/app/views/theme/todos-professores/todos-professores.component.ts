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
  FormModule,
  RowComponent,
  TextColorDirective
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ProfessoresService } from '../../../service/professores-service/professores.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todos-professores',
  templateUrl: './todos-professores.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

  ]
})
export class TodosProfessoresComponent {
  professores: any[] = [];
  professoresFiltrados: any[] = []; // Lista filtrada
  isLoading: boolean = true;
  filtro: string = ''; // Texto do filtro
  userType: string | null = null;
  isAdmin: boolean = false
  constructor(private professoresService: ProfessoresService) {}

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType'); // Obtem o tipo de usuário

    if (this.userType !== 'admin') {
      this.isAdmin = false;
      return;
    }

    this.isAdmin = true;

    this.professoresService.getProfessores().subscribe(
      (response: any) => {
        this.professores = response;
        this.professoresFiltrados = [...this.professores]; // Inicializa com todos os professores
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Erro ao buscar professores', error);
        this.isLoading = false;
      }
    );
  }

  filtrarProfessores(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.professoresFiltrados = this.professores.filter(professor =>
      professor.nome.toLowerCase().includes(filtroLower) ||
      professor.sobrenome.toLowerCase().includes(filtroLower) ||
      professor.email.toLowerCase().includes(filtroLower) ||
      professor.disciplinas.some((disciplina: any) =>
        disciplina.nome.toLowerCase().includes(filtroLower)
      )
    );
  }
}
