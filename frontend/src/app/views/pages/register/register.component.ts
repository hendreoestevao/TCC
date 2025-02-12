import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [FormsModule,CommonModule,ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective]
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  // Método chamado ao enviar o formulário


  register() {
    if (this.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'As senhas não correspondem.',
        confirmButtonColor: '#007BFF'
      });
      return;
    }

    this.passwordMismatch = false;
    this.loading = true;

    const payload = {
      username: this.username,
      password: this.password,
      role: 'ROLE_ADMIN'
    };

    this.http.post('http://localhost:8080/api/admin/register', payload, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text' // Define que a resposta será tratada como texto
    }).subscribe({
      next: (response: string) => {

        if (response === 'Admin user registered successfully') {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Conta criada com sucesso!',
            confirmButtonColor: '#007BFF'
          });

          this.username = '';
          this.password = '';
          this.confirmPassword = '';
        } else {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Resposta inesperada do servidor.',
            confirmButtonColor: '#007BFF'
          });
        }
      },
      error: (err) => {
        this.loading = false;

        console.error('Erro na requisição:', err);

        let errorMessage = 'Falha ao criar conta. Tente novamente mais tarde.';
        if (err.status === 403) {
          errorMessage = 'Você não tem permissão para realizar esta ação.';
        } else if (err.status === 409) {
          errorMessage = 'O nome de usuário já está em uso. Escolha outro.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: errorMessage,
          confirmButtonColor: '#007BFF'
        });
      }
    });
  }
}
