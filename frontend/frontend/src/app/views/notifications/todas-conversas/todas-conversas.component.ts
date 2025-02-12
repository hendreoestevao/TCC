import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConversasService } from '../../../service/conversa-service/conversas.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todas-conversas',
  templateUrl: './todas-conversas.component.html',
  styleUrls: ['./todas-conversas.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class TodasConversasComponent implements OnInit, OnDestroy {
  public conversas: any[] = [];
  public content: string = '';
  public studentId: number = 0;
  public teacherId: number = 0;
  public userType: string = localStorage.getItem('userType') || 'student';
  public selectedConversa: any = null;
  private globalIntervalId: any;
  private modalIntervalId: any;

  constructor(private conversasService: ConversasService) {}

  ngOnInit(): void {
    this.teacherId = Number(localStorage.getItem('professorId')); // Recupera o teacherId
    this.userType = localStorage.getItem('userType') || 'student'; // Recupera o tipo de usuário

    if (this.userType === 'professor') {
      this.buscarConversasByProfessor(); // Se for professor
    } else {
      this.buscarConversas(); // Se for aluno
    }

    // Atualizar as conversas globais a cada 5 segundos
    this.globalIntervalId = setInterval(() => {
      if (this.userType === 'professor') {
        this.buscarConversasByProfessor();
      } else {
        this.buscarConversas();
      }
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.globalIntervalId) {
      clearInterval(this.globalIntervalId); // Limpa o intervalo global ao destruir o componente
    }
    if (this.modalIntervalId) {
      clearInterval(this.modalIntervalId); // Limpa o intervalo do modal ao destruir o componente
    }
  }

  // Método para buscar as conversas do professor
  buscarConversasByProfessor(): void {
    this.conversasService.buscarConversasByProfessor(this.teacherId).subscribe(
      (data: any[]) => {
        this.conversas = this.removerConversasDuplicadas(data);
      },
      (error: any) => {
        console.error('Erro ao buscar conversas', error);
      }
    );
  }

  // Método para buscar as conversas do aluno
  buscarConversas(): void {
    this.conversasService.buscarConversas(this.studentId, this.teacherId).subscribe(
      (data: any[]) => {
        if (this.selectedConversa) {
          this.selectedConversa.messages = data;
        }
      },
      (error: any) => {
        console.error('Erro ao buscar mensagens', error);
      }
    );
  }

  // Método para remover conversas duplicadas
  removerConversasDuplicadas(conversas: any[]): any[] {
    const idsEncontrados = new Set();
    return conversas.filter(conversa => {
      if (idsEncontrados.has(conversa.studentId)) {
        return false;
      }
      idsEncontrados.add(conversa.studentId);
      return true;
    });
  }

  // Método para enviar uma nova mensagem
  enviarMensagem(): void {
    if (!this.content.trim()) {
      console.warn('Mensagem vazia não pode ser enviada.');
      return;
    }

    const timestamp = new Date().toISOString();
    const role = this.userType === 'professor' ? 'teacher' : 'student';

    this.conversasService.enviarMensagem(this.content, this.studentId, this.teacherId, timestamp, role).subscribe(
      () => {
        this.content = ''; // Limpa o campo após o envio
        if (this.selectedConversa) {
          this.buscarConversas(); // Atualiza as mensagens do chat atual
        }
      },
      (error) => {
        console.error('Erro ao enviar mensagem:', error);
      }
    );
  }

  // Método para abrir o chat de uma conversa específica
  abrirChat(conversa: any): void {
    this.selectedConversa = conversa;
    this.studentId = conversa.studentId;

    if (!this.selectedConversa.messages) {
      this.selectedConversa.messages = [];
    }

    this.buscarConversas(); // Atualiza imediatamente ao abrir o modal

    // Atualizar as mensagens no modal a cada 1 segundo
    this.modalIntervalId = setInterval(() => {
      this.buscarConversas();
    }, 1000);
  }

  // Fechar o modal
  fecharModal(): void {
    this.selectedConversa = null;

    // Limpa o intervalo do modal
    if (this.modalIntervalId) {
      clearInterval(this.modalIntervalId);
    }
  }
}
