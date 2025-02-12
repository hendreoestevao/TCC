import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> saveStudentData(Map<String, dynamic> alunoData) async {
  print("Dados recebidos: $alunoData");  // Verifique o conteúdo aqui

  final prefs = await SharedPreferences.getInstance();

  // Salvando dados simples como strings
  await prefs.setString('token', alunoData['token']);
  await prefs.setString('alunoId', alunoData['alunoId']);
  await prefs.setString('alunoNome', alunoData['nome']);
  await prefs.setString('alunoSobrenome', alunoData['sobrenome']);
  await prefs.setString('alunoEmail', alunoData['email']);

  // Salvando listas de faltas e notas como strings JSON
  await prefs.setString('alunoFaltas', jsonEncode(alunoData['faltas']));
  await prefs.setString('alunoNotas', jsonEncode(alunoData['notas']));
}
