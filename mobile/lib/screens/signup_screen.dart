import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../components/page_title_bar.dart';
import '../components/under_part.dart';
import '../components/upside.dart';
import '../widgets/rounded_button.dart';
import '../widgets/rounded_input_field.dart';
import 'login_screen.dart';

class RecoverPasswordScreen extends StatefulWidget {
  const RecoverPasswordScreen({Key? key}) : super(key: key);

  @override
  _RecoverPasswordScreenState createState() => _RecoverPasswordScreenState();
}

class _RecoverPasswordScreenState extends State<RecoverPasswordScreen> {
  final TextEditingController _raController = TextEditingController();
  final TextEditingController _courseController = TextEditingController();

  // Função para enviar a solicitação de recuperação de senha
  Future<void> _submitRequest() async {
    final ra = _raController.text.trim();
    final course = _courseController.text.trim();

    if (ra.isEmpty || course.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor, preencha todos os campos.')),
      );
      return;
    }

    // Criação do corpo da requisição
    final body = {
      "title": "Recuperação de Senha",
      "message": "Olá, sou o aluno de RA $ra do curso $course e quero recuperar minha senha."
    };

    try {
      final response = await http.post(
        Uri.parse('http://192.168.56.1:8080/notifications'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        // Mostrar uma confirmação
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Solicitação enviada com sucesso!')),
        );
      } else {
        // Tratar erro na requisição
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao enviar solicitação: ${response.statusCode}')),
        );
      }
    } catch (e) {
      // Tratar erro na requisição
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao enviar solicitação: $e')),
      );
    }

    // Limpar os campos após o envio
    _raController.clear();
    _courseController.clear();
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return SafeArea(
      child: Scaffold(
        body: SizedBox(
          width: size.width,
          height: size.height,
          child: SingleChildScrollView(
            child: Stack(
              children: [
                const Upside(
                  imgUrl: "assets/images/register.png", // Imagem para recuperação de senha
                ),
                const PageTitleBar(title: 'Recuperar Senha'),
                Padding(
                  padding: const EdgeInsets.only(top: 320.0),
                  child: Container(
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(50),
                        topRight: Radius.circular(50),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const SizedBox(height: 20),
                        const Text(
                          "Preencha os campos abaixo para solicitar a recuperação de senha.",
                          style: TextStyle(
                            color: Colors.grey,
                            fontFamily: 'OpenSans',
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 40),
                        // Campo para RA
                        RoundedInputField(
                          controller: _raController,
                          hintText: "Digite seu RA",
                          icon: Icons.school,
                        ),
                        // Campo para Curso
                        RoundedInputField(
                          controller: _courseController,
                          hintText: "Digite o nome do seu curso",
                          icon: Icons.book,
                        ),
                        const SizedBox(height: 20),
                        // Botão de envio
                        RoundedButton(
                          text: 'ENVIAR SOLICITAÇÃO',
                          press: _submitRequest,
                        ),
                        const SizedBox(height: 20),
                        // Opção para voltar à tela de login
                        UnderPart(
                          title: "Já tem uma conta?",
                          navigatorText: "Login aqui",
                          onTap: () {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(builder: (context) => const LoginScreen()),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
