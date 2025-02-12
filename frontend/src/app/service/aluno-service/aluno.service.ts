import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private apiUrl = 'http://localhost:8080/api/alunos';

  constructor(private http: HttpClient) {}

  // Método para pegar todos os alunos
  getTodosAlunos(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Método para criar um novo aluno
  criarAluno(aluno: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, aluno, { headers });
  }

  // Método para atualizar um aluno existente
  atualizarAluno(ra: string, aluno: any): Observable<any> {
    const headers = this.getAuthHeaders(); // Obtém os cabeçalhos com autenticação
    const url = `${this.apiUrl}/${ra}`; // Usa o RA como parâmetro na URL
    return this.http.put<any>(url, aluno, { headers });
  }
  // Método privado para obter headers com autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  getAlunosPorTurma(turmaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/turma/${turmaId}`);
  }
}
