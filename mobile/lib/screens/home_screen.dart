import 'package:flutter/material.dart';
import 'package:tcc/constants.dart';
import 'package:tcc/screens/calendar_screen.dart';
import 'package:tcc/screens/initial_screen.dart';
import 'package:tcc/screens/notas_screen.dart';
import 'package:tcc/screens/perfil_screen.dart';
import 'package:tcc/widgets/app_header.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io';
import 'pre_chat_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0; // Índice da aba selecionada
  String userName = ''; // Nome do aluno
  String userSurname = ''; // Sobrenome do aluno
  File? _profileImage; // Imagem de perfil do aluno

  // Listagem das telas correspondentes a cada aba
  final List<Widget> _pages = [
     InitialScreen(),
     NotasScreen(),
     CalendarScreen(),
     PreChatScreen(),
     ProfileScreen(),
  ];

  @override
  void initState() {
    super.initState();
    getStudentData(); // Carrega dados do aluno
    fetchData(); // Busca dados adicionais da API
  }

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
        final data = jsonDecode(response.body);

        setState(() {
          userName = '${data['aluno']['nome']} ${data['aluno']['sobrenome']}';
          userSurname = data['aluno']['curso']['nome'];
        });
      } else {
        print('Erro ao carregar dados: ${response.statusCode}');
      }
    } catch (e) {
      print('Erro ao buscar dados: $e');
    }
  }

  Future<void> getStudentData() async {
    final prefs = await SharedPreferences.getInstance();
    final nome = prefs.getString('alunoNome');
    final sobrenome = prefs.getString('alunoSobrenome');
    final profileImagePath = prefs.getString('profileImagePath');

    setState(() {
      userName = nome ?? ''; // Atualiza o nome do aluno
      userSurname = sobrenome ?? ''; // Atualiza o sobrenome
      if (profileImagePath != null) {
        _profileImage = File(profileImagePath); // Carrega a imagem de perfil salva
      }
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index; // Atualiza a aba selecionada
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppHeader(
        userName: '$userName $userSurname',
        userImageFile: _profileImage, // Passa a imagem de perfil (se houver)
      ),
      body: _pages[_selectedIndex], // Exibe a tela correspondente à aba
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.note),
            label: 'Notas',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month),
            label: 'Calendário',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat),
            label: 'Chat',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Perfil',
          ),
        ],
        currentIndex: _selectedIndex, // Aba selecionada
        selectedItemColor: kPrimaryColor, // Cor verde para selecionado
        unselectedItemColor: kPrimaryColor.withOpacity(0.5), // Cor esmaecida
        onTap: _onItemTapped, // Altera a aba selecionada
      ),
    );
  }
}
