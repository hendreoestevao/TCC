import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class NotasScreen extends StatefulWidget {
  const NotasScreen({Key? key}) : super(key: key);

  @override
  _NotasScreenState createState() => _NotasScreenState();
}

class _NotasScreenState extends State<NotasScreen> {
  List<Map<String, dynamic>> semestres = [];
  bool isLoading = true;

  // Função para buscar os dados da API
  Future<void> fetchData() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final alunoId = prefs.getString('alunoId');

    if (token == null || alunoId == null) {
      print('Token ou AlunoID não encontrado.');
      return;
    }

    final url = Uri.parse('http://192.168.56.1:8080/api/alunos/$alunoId');

    try {
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        setState(() {
          semestres = _processarNotas(data['notasEFaltas']);
          isLoading = false;
        });
      } else {
        print('Falha ao carregar dados: ${response.statusCode}');
      }
    } catch (e) {
      print('Erro ao buscar dados: $e');
    }
  }

  // Processa os dados recebidos da API
  List<Map<String, dynamic>> _processarNotas(List<dynamic> notasEFaltas) {
    Map<String, List<Map<String, dynamic>>> semestresMap = {};

    for (var item in notasEFaltas) {
      final disciplina = item['disciplina'];
      final semestre = disciplina['nome']; // Simulando a estrutura de semestres

      if (!semestresMap.containsKey(semestre)) {
        semestresMap[semestre] = [];
      }

      semestresMap[semestre]?.add({
        'nome': disciplina['nome'],
        'nota': item['nota'],
        'faltas': item['faltas'],
      });
    }

    return semestresMap.entries.map((entry) {
      return {
        'nome': entry.key,
        'materias': entry.value,
      };
    }).toList();
  }

  // Função para calcular a média de notas e faltas de um semestre
  Map<String, double> calcularMedias(List<Map<String, dynamic>> materias) {
    double totalNotas = 0;
    int totalFaltas = 0;
    int count = materias.length;

    for (var materia in materias) {
      totalNotas += materia['nota'] as double;
      totalFaltas += materia['faltas'] as int;
    }

    return {
      'mediaNotas': totalNotas / count,
      'mediaFaltas': totalFaltas / count,
    };
  }

  @override
  void initState() {
    super.initState();
    fetchData(); // Chama a função para carregar os dados ao iniciar a tela
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notas e Faltas'),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: semestres.length,
              itemBuilder: (context, semestreIndex) {
                final semestre = semestres[semestreIndex];
                final medias = calcularMedias(semestre['materias']);
                final mediaNotas = medias['mediaNotas'];
                final mediaFaltas = medias['mediaFaltas'];
return ExpansionTile(
  title: Text(
    semestre['nome'],
    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
  ),
  subtitle: Row(
    children: [
      Text(
        'Média Notas: ',
        style: const TextStyle(color: Colors.grey),
      ),
      Text(
        mediaNotas!.toStringAsFixed(1),
        style: TextStyle(
          color: mediaNotas >= 7.0 ? Colors.green : Colors.red,
          fontWeight: FontWeight.bold,
        ),
      ),
      const SizedBox(width: 10),
      Text(
        'Média Faltas: ${mediaFaltas?.toStringAsFixed(1)}',
        style: const TextStyle(color: Colors.grey),
      ),
    ],
  ),
  children: semestre['materias'].map<Widget>((materia) {
    return ListTile(
      title: Text(
        materia['nome'],
        style: const TextStyle(fontWeight: FontWeight.bold),
      ),
      subtitle: Text(
        'Faltas: ${materia['faltas']}',
      ),
      trailing: Text(
        'Nota: ${materia['nota']}',
        style: TextStyle(
          color: (materia['nota'] as double) >= 7.0 ? Colors.green : Colors.red,
          fontWeight: FontWeight.bold,
        ),
      ),
      onTap: () => _showMateriaDetalhes(context, materia),
    );
  }).toList(),
);


              },
            ),
    );
  }

  // Função para exibir detalhes da matéria com barra de progresso
  void _showMateriaDetalhes(BuildContext context, Map<String, dynamic> materia) {
    final isAprovado = (materia['nota'] as double) >= 7.0;

    showModalBottomSheet(
      context: context,
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                materia['nome'],
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              LinearProgressIndicator(
                value: (materia['nota'] as double) / 10, // Exibindo a nota como barra de progresso (de 0 a 10)
                color: isAprovado ? Colors.green : Colors.red,
                backgroundColor: Colors.grey[300],
              ),
              const SizedBox(height: 8),
              Text(
                'Nota: ${materia['nota']}',
                style: TextStyle(
                  fontSize: 16,
                  color: isAprovado ? Colors.green : Colors.red,
                ),
              ),
              Text(
                'Faltas: ${materia['faltas']}',
                style: const TextStyle(fontSize: 16),
              ),
            ],
          ),
        );
      },
    );
  }
}
