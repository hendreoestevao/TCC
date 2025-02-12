import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private adminUrl = 'http://localhost:8080/api/auth/login';
  private professorUrl = 'http://localhost:8080/api/professores/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string, userType: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ username, password });

    // Define a URL com base no tipo de usuário
    const apiUrl = userType === 'admin' ? this.adminUrl : this.professorUrl;

    return this.http.post<any>(apiUrl, body, { headers }).pipe(
      tap((response) => {
        // Salva o token e o tipo de usuário no Local Storage se o login for bem-sucedido
        if (response && response.token) {
          this.setToken(response.token);
          this.setUserType(userType);  // Salva o tipo de usuário no Local Storage
          if (userType === 'professor' && response.id) {
            this.setProfessorId(response.id);  // Salva o id do professor no Local Storage
          }

          Swal.fire('Login bem-sucedido!', 'Você está logado.', 'success');
          
        }
      }),
      catchError((error) => {
        // Exibe erro caso o login falhe
        Swal.fire('Erro de login', 'Credenciais inválidas.', 'error');
        return of(null);
      })
    );
  }
  private setProfessorId(id: string): void {
    localStorage.setItem('professorId', id);
  }

  // Função para salvar o token
  private setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Função para salvar o tipo de usuário
  private setUserType(userType: string): void {
    localStorage.setItem('userType', userType);
  }

  // Função para recuperar o token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Função para recuperar o tipo de usuário
  getUserType(): string | null {
    return localStorage.getItem('userType');
  }

  // Função para verificar se o usuário está logado
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Função para logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');  // Remove o tipo de usuário também ao deslogar
  }
}
