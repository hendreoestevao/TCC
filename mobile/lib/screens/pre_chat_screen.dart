import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'chat_screen.dart';

class PreChatScreen extends StatefulWidget {
  @override
  _PreChatScreenState createState() => _PreChatScreenState();
}

class _PreChatScreenState extends State<PreChatScreen> {
  List<Map<String, dynamic>> professores = [];
  bool isLoading = true;
  String? errorMessage;
  int? cursoId;
  int? alunoId2;

  @override
  void initState() {
    super.initState();
    fetchAlunoData(); // Busca os dados do aluno (cursoId e alunoId2)
  }

  Future<void> fetchAlunoData() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final ra = prefs.getString('alunoId'); // RA é o alunoId no contexto do token

    if (token == null || ra == null) {
      setState(() {
        errorMessage = 'Erro: Token ou RA não encontrado no SharedPreferences.';
        isLoading = false;
      });
      return;
    }

    final url = Uri.parse('http://192.168.56.1:8080/api/alunos/$ra');

    try {
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        final aluno = data['aluno'];
        final int fetchedCursoId = aluno['cursoId'] ?? 0;
        final int fetchedAlunoId2 = aluno['id'];

        setState(() {
          cursoId = fetchedCursoId;
          alunoId2 = fetchedAlunoId2;
        });

        // Salvar cursoId e alunoId2 no SharedPreferences
        await prefs.setString('cursoId', fetchedCursoId.toString());
        await prefs.setString('idAluno2', fetchedAlunoId2.toString());

        fetchProfessores(); // Busca os professores com o cursoId
      } else {
        setState(() {
          errorMessage = 'Erro ao buscar dados do aluno: ${response.statusCode}';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Erro ao buscar dados do aluno: $e';
        isLoading = false;
      });
    }
  }

  Future<void> fetchProfessores() async {
    if (cursoId == null) return;

    final url = Uri.parse('http://192.168.56.1:8080/api/professores/curso/$cursoId');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
print('cursoId: $cursoId');
print('chamando fetchProfessores...');

        List<Map<String, dynamic>> professorsList = [];
        for (var professor in data) {
          if (professor is Map<String, dynamic>) {
            professorsList.add({
              'id': professor['id'],
              'nome': professor['nome'] ?? 'Nome não disponível',
              'sobrenome': professor['sobrenome'] ?? 'Sobrenome não disponível',
              'disciplinas': professor['disciplinas'] ?? [],
            });
          }
        }

        setState(() {
          professores = professorsList;
          isLoading = false;
        });
      } else {
        setState(() {
          errorMessage = 'Erro ao buscar professores: ${response.statusCode}';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Erro ao buscar professores: $e';
        isLoading = false;
      });
    }
  }

  void iniciarChat(int teacherId, String teacherName) {
    if (teacherId != null && teacherName.isNotEmpty && alunoId2 != null) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => ChatScreen(
            studentId: alunoId2!,
            teacherId: teacherId,
            userName: teacherName,
          ),
        ),
      );
    } else {
      print('Erro: Dados do professor ou aluno inválidos');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : errorMessage != null
              ? Center(child: Text(errorMessage!))
              : ListView.builder(
                  itemCount: professores.length,
                  itemBuilder: (context, index) {
                    final professor = professores[index];

                    return Card(
                      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ListTile(
                        leading: const Icon(Icons.person, size: 40),
                        title: Text(
                          '${professor['nome']} ${professor['sobrenome']}',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        subtitle: professor['disciplinas'].isEmpty
                            ? const Text('Nenhuma disciplina atribuída')
                            : Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: professor['disciplinas']
                                    .map<Widget>((disciplina) => Text(
                                          '${disciplina['nome']} - ${disciplina['cargaHoraria']} horas',
                                          style: const TextStyle(fontSize: 16),
                                        ))
                                    .toList(),
                              ),
                        trailing: IconButton(
                          icon: const Icon(Icons.chat, color: Colors.blue),
                          onPressed: () {
                            iniciarChat(professor['id'], professor['nome']);
                          },
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
