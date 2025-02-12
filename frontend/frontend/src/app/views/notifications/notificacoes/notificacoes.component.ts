import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, BadgeComponent, ButtonDirective, BorderDirective } from '@coreui/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.scss'],
  standalone: true,
  imports: [CommonModule, RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, BadgeComponent, ButtonDirective, BorderDirective]
})
export class NotificacoesComponent implements OnInit {

 // Lista de notificações
 notifications: { id: number, title: string, message: string, createdAt: string }[] = [];
 // Contagem total de notificações
 totalNotifications: number = 0;
 userType: string | null = null;
  isAdmin: boolean = false;
 // URL da API de notificações
 private notificationsUrl = 'http://localhost:8080/notifications';
 private notificationsCountUrl = 'http://localhost:8080/notifications/count';

 constructor(private http: HttpClient) { }

 ngOnInit(): void {
  this.userType = localStorage.getItem('userType'); // Obtem o tipo de usuário

  if (this.userType !== 'admin') {
    this.isAdmin = false;
    return;
  }

  this.isAdmin = true;
   // Chama o método para buscar as notificações da API ao iniciar o componente
   this.getNotifications();
   this.getNotificationsCount();
 }

 // Função para buscar notificações da API
 getNotifications(): void {
   this.http.get<{ id: number, title: string, message: string, createdAt: string }[]>(this.notificationsUrl)
     .subscribe(
       (data) => {
         // Atualiza a lista de notificações com os dados recebidos
         this.notifications = data;
       },
       (error) => {
         console.error('Erro ao buscar notificações', error);
       }
     );
 }

 // Função para excluir uma notificação
 deleteNotification(id: number): void {
   Swal.fire({
     title: 'Tem certeza?',
     text: 'Você deseja realmente deletar esta notificação? Esta ação não pode ser desfeita.',
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#d33',
     cancelButtonColor: '#3085d6',
     confirmButtonText: 'Sim, deletar!',
     cancelButtonText: 'Cancelar',
   }).then((result) => {
     if (result.isConfirmed) {
       // Se o usuário confirmar a exclusão, faz a chamada para o backend
       this.http.delete(`${this.notificationsUrl}/${id}`).subscribe(
         () => {
           // Após a exclusão, remove a notificação da lista local
           this.notifications = this.notifications.filter(notification => notification.id !== id);
           // Atualiza a contagem total de notificações
           console.error('Erro ao excluir notificação');
           Swal.fire({
             icon: 'error',
             title: 'Erro!',
             text: 'Erro ao deletar a notificação.',
           });
         },
         (error) => {
          this.getNotificationsCount();
          // Recarrega as notificações
          this.getNotifications();
          // Exibe a mensagem de sucesso
          Swal.fire({
            icon: 'success',
            title: 'Notificação deletada!',
            text: 'A notificação foi deletada com sucesso!',
          });

         }
       );
     }
   });
 }

 // Função para buscar o total de notificaçõesngOnInit(): void {
  // Chama o método para buscar as notificações da API ao iniciar o componente

  getNotificationsCount(): void {
    this.http.get<number>(this.notificationsCountUrl).subscribe(
      (count) => {
        this.totalNotifications = count;  // Atualiza o total de notificações

        // Armazena o valor no localStorage
        localStorage.setItem('totalNotifications', this.totalNotifications.toString());
      },
      (error) => {
      }
    );
  }


}
