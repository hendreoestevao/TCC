# Sistema Acadêmico - TCC

## Sobre o Projeto
Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) e consiste em um sistema acadêmico completo, permitindo o gerenciamento de alunos, notas, comunicação entre alunos e professores, e outras funcionalidades essenciais para o ambiente acadêmico.

## Tecnologias Utilizadas
O projeto foi desenvolvido utilizando as seguintes tecnologias:

- **Backend:** Java com Spring Boot 3.4.0
- **Banco de Dados:** PostgreSQL
- **Autenticação:** Spring Security com JWT
- **Frontend (Painel Administrativo para Professores):** Angular com Angular Material
- **Aplicativo Mobile para Alunos:** Flutter

## Estrutura do Sistema
O sistema é dividido em duas principais interfaces:

### 1. **Painel Administrativo (Professores e Administradores)**
Desenvolvido em Angular, este painel permite que os professores realizem o gerenciamento acadêmico, incluindo:
- Cadastro e edição de alunos
- Lançamento de notas
- Acompanhamento de métricas e desempenho acadêmico
- Chat com os alunos para suporte e esclarecimento de dúvidas
- Gráficos e relatórios com estatísticas sobre o desempenho dos alunos

### 2. **Aplicativo Mobile para Alunos**
Desenvolvido em Flutter, o aplicativo permite que os alunos:
- Consultem suas notas e desempenho acadêmico
- Recebam notificações de atualizações e mensagens dos professores
- Utilizem um chat para comunicação direta com os professores
- Acompanhem calendário acadêmico e eventos

## Funcionalidades Implementadas
- **Autenticação Segura:** Login e gerenciamento de sessões com JWT
- **Cadastro e Gerenciamento de Alunos e Professores**
- **Registro e Consulta de Notas e Médias**
- **Gerenciamento de Cursos e Semestres**
- **Chat em Tempo Real entre Alunos e Professores**
- **Dashboard com Gráficos e Relatórios Acadêmicos**
- **Notificações Push para Alunos (Flutter + Firebase Messaging)**
- **Interface Responsiva e Intuitiva no Painel Administrativo (Angular Material)**

## Instalação e Execução
### Backend (Spring Boot)
1. Clone o repositório
2. Configure o banco de dados PostgreSQL
3. Altere as credenciais no `application.properties`
4. Execute o backend com:
   ```bash
   mvn spring-boot:run
   ```

### Painel Administrativo (Angular)
1. Acesse a pasta do painel
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o projeto:
   ```bash
   ng serve
   ```

### Aplicativo Mobile (Flutter)
1. Acesse a pasta do app Flutter
2. Instale as dependências:
   ```bash
   flutter pub get
   ```
3. Execute no emulador ou dispositivo físico:
   ```bash
   flutter run
   ```

## Considerações Finais
Este sistema acadêmico foi desenvolvido para facilitar o gerenciamento acadêmico, trazendo mais eficiência e integração entre professores e alunos. Com o uso de tecnologias modernas, o sistema proporciona uma experiência fluida e intuitiva para seus usuários.

Se tiver dúvidas ou sugestões, entre em contato!

---
**Autor:** Hendreo Estevão
**Ano:** 2024

