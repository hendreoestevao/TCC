import 'dart:async'; // Import necessário para o Timer
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ChatScreen extends StatefulWidget {
  final int studentId;
  final int teacherId;
  final String userName;

  const ChatScreen({
    Key? key,
    required this.studentId,
    required this.teacherId,
    required this.userName,
  }) : super(key: key);

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  TextEditingController _messageController = TextEditingController();
  List<Map<String, dynamic>> messages = [];
  bool isLoading = true;
  Timer? _messageFetchTimer;

  @override
  void initState() {
    super.initState();
    fetchMessages(); // Busca as mensagens na inicialização
    startAutoFetch(); // Inicia a repetição automática
  }

  @override
  void dispose() {
    _messageFetchTimer?.cancel(); // Cancela o Timer quando o widget é descartado
    super.dispose();
  }

  // Função para iniciar o fetch automático
  void startAutoFetch() {
    _messageFetchTimer = Timer.periodic(
      const Duration(seconds: 1), // Intervalo de 1 segundo
      (Timer timer) {
        fetchMessages();
      },
    );
  }

  // Função para buscar mensagens do backend
  Future<void> fetchMessages() async {
    final url = Uri.parse(
      'http://192.168.56.1:8080/api/messages?studentId=${widget.studentId}&teacherId=${widget.teacherId}',
    );
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        setState(() {
          messages = data.map((message) {
            return {
              'content': message['content'],
              'timestamp': message['timestamp'],
              'role': message['role'], // Adicionando o role para verificar quem enviou
            };
          }).toList();
          isLoading = false;
        });
      } else {
        setState(() {
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
    }
  }

  // Função para enviar a mensagem
 // Função para enviar a mensagem
Future<void> sendMessage() async {
  final content = _messageController.text;
  if (content.isEmpty) return;

  // Recupera nome e sobrenome do SharedPreferences
  final prefs = await SharedPreferences.getInstance();
  final nome = prefs.getString('alunoNome') ?? 'Aluno';
  final sobrenome = prefs.getString('alunoSobrenome') ?? 'Sem Sobrenome';

  final url = Uri.parse('http://192.168.56.1:8080/api/messages');
  try {
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'content': content,
        'studentId': widget.studentId,
        'teacherId': widget.teacherId,
        'timestamp': DateTime.now().toIso8601String(),
        'role': 'student', // Role definido como 'student'
        'studentName': '$nome $sobrenome', // Nome e sobrenome do aluno
      }),
    );
    if (response.statusCode == 200) {
      _messageController.clear();
      fetchMessages(); // Atualiza as mensagens após enviar
    }
  } catch (e) {
    // Tratar erro na requisição
    print('Erro ao enviar mensagem: $e');
  }
}


  // Função para formatar o timestamp
  String formatTimestamp(String timestamp) {
    final dateTime = DateTime.parse(timestamp);
    return "${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Chat com ${widget.userName}'),
      ),
      body: Column(
        children: [
          Expanded(
            child: isLoading
                ? Center(child: CircularProgressIndicator())
                : ListView.builder(
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      final message = messages[index];
                      final role = message['role'];

                      bool isSentByStudent = role == 'student';

                      return Align(
                        alignment: isSentByStudent
                            ? Alignment.centerRight // Mensagem enviada pelo aluno
                            : Alignment.centerLeft, // Mensagem recebida do professor
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4.0, horizontal: 16.0),
                          child: Container(
                            padding: EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: isSentByStudent ? Colors.blue[200] : Colors.green[200],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  message['content'],
                                  style: TextStyle(fontSize: 16),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  formatTimestamp(message['timestamp']),
                                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: InputDecoration(
                      hintText: 'Digite uma mensagem...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.send),
                  onPressed: sendMessage, // Chama a função de envio
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
